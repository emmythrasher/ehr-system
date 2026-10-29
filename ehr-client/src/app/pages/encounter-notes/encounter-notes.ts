import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule
} from '@angular/forms';

import { ActivatedRoute } from '@angular/router';

import {
  ClinicalNoteService,
  FhirDocumentReference
} from '../../services/clinical-note';

@Component({
  selector: 'app-encounter-notes',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './encounter-notes.html',
  styleUrl: './encounter-notes.scss'
})
export class EncounterNotes implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private noteService = inject(ClinicalNoteService);

  patientId =
    this.route.parent?.parent?.snapshot.paramMap.get('id') ?? '';

  encounterId =
    this.route.parent?.snapshot.paramMap.get('encounterId') ?? '';

  // Existing FHIR document, if one was previously saved.
  existingNote = signal<FhirDocumentReference | null>(null);

  loading = signal(true);
  saving = signal(false);
  error = signal('');
  success = signal('');

  ready = signal(false);

  form = this.fb.nonNullable.group({
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });

  ngOnInit(): void {
    this.loadDraft();
  }

  private encodeBase64(text: string): string {
    const bytes = new TextEncoder().encode(text);

    let binary = '';

    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }

    return btoa(binary);
  }

  private decodeBase64(encoded: string): string {
    const binary = atob(encoded);

    const bytes = Uint8Array.from(
      binary,
      character => character.charCodeAt(0)
    );

    return new TextDecoder().decode(bytes);
  }

  private parseSoap(text: string): void {
    const match = text.match(
      /^SUBJECTIVE\n([\s\S]*?)\n\nOBJECTIVE\n([\s\S]*?)\n\nASSESSMENT\n([\s\S]*?)\n\nPLAN\n([\s\S]*)$/
    );

    if (!match) {
      throw new Error('Unrecognized SOAP note format');
    }

    this.form.patchValue({
      subjective: match[1],
      objective: match[2],
      assessment: match[3],
      plan: match[4]
    });
  }

  loadDraft(): void {
    this.ready.set(false);
    if (!this.patientId || !this.encounterId) {
      this.error.set('Patient or encounter ID is missing.');
      this.loading.set(false);
      if (this.ready()) {
        this.success.set('Draft loaded successfully.');
      }
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.success.set('');

    this.noteService.getNotes(
      this.patientId,
      this.encounterId
    ).subscribe({
      next: bundle => {
        // Only consider preliminary SOAP progress notes
        // belonging to this patient and encounter.
        const drafts = (bundle.entry ?? [])
          .map(entry => entry.resource)
          .filter(note =>
            note.status === 'current' &&
            note.docStatus === 'preliminary' &&
            note.type?.coding?.some(coding =>
              coding.system === 'http://loinc.org' &&
              coding.code === '11506-3'
            ) &&
            note.subject?.reference ===
            `Patient/${this.patientId}` &&
            note.context?.encounter?.some(ref =>
              ref.reference === `Encounter/${this.encounterId}`
            )
          )
          .sort((a, b) =>
            (b.date ?? '').localeCompare(a.date ?? '')
          );

        const draft = drafts[0];

        if (draft) {
          try {
            const encoded = draft.content?.[0]?.attachment?.data;

            if (!encoded) {
              throw new Error('Note attachment is missing');
            }

            const text = this.decodeBase64(encoded);
            this.parseSoap(text);
            this.existingNote.set(draft);

          } catch (err) {
            console.error('Unable to decode SOAP note:', err);
            this.error.set(
              'The existing note could not be loaded.'
            );
          }
        } else {
          this.existingNote.set(null);
          this.form.reset();
        }

        this.loading.set(false);
        this.ready.set(!this.error());
      },

      error: err => {
        console.error('Failed to retrieve notes:', err);
        this.error.set('Unable to retrieve clinical notes.');
        this.loading.set(false);
      }
    });
  }

  saveDraft(): void {
    if (this.loading() || this.saving() || !this.ready()) {
      return;
    }

    this.error.set('');

    const values = this.form.getRawValue();

    if (!Object.values(values).some(value => value.trim())) {
      this.error.set('Enter note content before saving.');
      return;
    }

    const noteText = [
      `SUBJECTIVE\n${values.subjective}`,
      `OBJECTIVE\n${values.objective}`,
      `ASSESSMENT\n${values.assessment}`,
      `PLAN\n${values.plan}`
    ].join('\n\n');

    const existing = this.existingNote();

    const note: FhirDocumentReference = {
      ...existing,
      resourceType: 'DocumentReference',
      status: 'current',
      docStatus: 'preliminary',

      type: {
        coding: [{
          system: 'http://loinc.org',
          code: '11506-3',
          display: 'Progress note'
        }],
        text: 'SOAP Progress Note'
      },

      subject: {
        reference: `Patient/${this.patientId}`
      },

      date: new Date().toISOString(),

      context: {
        ...existing?.context,
        encounter: [{
          reference: `Encounter/${this.encounterId}`
        }]
      },

      content: [{
        attachment: {
          contentType: 'text/plain',
          title: 'SOAP Progress Note',
          data: this.encodeBase64(noteText)
        }
      }]
    };

    this.saving.set(true);
    this.error.set('');
    this.success.set('');

    const request = existing?.id
      ? this.noteService.updateNote(existing.id, note)
      : this.noteService.createNote(note);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.loadDraft();
      },

      error: err => {
        console.error('Failed to save note:', err);
        this.error.set('Unable to save SOAP note.');
        this.saving.set(false);
      }
    });
  }
}
