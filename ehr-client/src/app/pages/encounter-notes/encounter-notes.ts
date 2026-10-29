
import { Component, inject, signal } from '@angular/core';
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
export class EncounterNotes {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private noteService = inject(ClinicalNoteService);

  // Our route hierarchy:
  // patients/:id/encounters/:encounterId/notes
  patientId =
    this.route.parent?.parent?.snapshot.paramMap.get('id') ?? '';

  encounterId =
    this.route.parent?.snapshot.paramMap.get('encounterId') ?? '';

  saving = signal(false);
  error = signal('');
  success = signal('');

  form = this.fb.nonNullable.group({
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });

  private encodeBase64(text: string): string {
    const bytes = new TextEncoder().encode(text);

    let binary = '';

    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }

    return btoa(binary);
  }

  saveDraft(): void {
    if (this.saving()) return;

    if (!this.patientId || !this.encounterId) {
      this.error.set('Patient or encounter ID is missing.');
      return;
    }

    const values = this.form.getRawValue();

    const noteText = [
      `SUBJECTIVE\n${values.subjective}`,
      `OBJECTIVE\n${values.objective}`,
      `ASSESSMENT\n${values.assessment}`,
      `PLAN\n${values.plan}`
    ].join('\n\n');

    if (!Object.values(values).some(value => value.trim())) {
      this.error.set('Enter note content before saving.');
      return;
    }

    const note: FhirDocumentReference = {
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

    this.noteService.createNote(note).subscribe({
      next: () => {
        this.saving.set(false);
        this.success.set('Draft note saved successfully.');
      },
      error: err => {
        console.error('Failed to save note:', err);
        this.error.set('Unable to save note.');
        this.saving.set(false);
      }
    });
  }
}

