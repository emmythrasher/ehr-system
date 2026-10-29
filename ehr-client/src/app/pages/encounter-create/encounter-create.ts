
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  EncounterService,
  FhirEncounter
} from '../../services/encounter';

@Component({
  selector: 'app-encounter-create',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './encounter-create.html',
  styleUrl: './encounter-create.scss'
})
export class EncounterCreate {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private encounterService = inject(EncounterService);

  // The patient ID belongs to the parent route.
  patientId = this.route.parent?.snapshot.paramMap.get('id') ?? '';

  saving = signal(false);
  error = signal('');

  form = this.fb.nonNullable.group({
    visitType: ['office', Validators.required],
    status: ['in-progress', Validators.required],
    startDate: ['', Validators.required]
  });

  save(): void {
    if (!this.patientId || this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue();

    // datetime-local produces a local date-time without a timezone.
    const start = new Date(values.startDate);

    if (Number.isNaN(start.getTime())) {
      this.error.set('Enter a valid visit date and time.');
      return;
    }

    const encounter: FhirEncounter = {
      resourceType: 'Encounter',
      status: values.status,

      class: {
        system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
        code: 'AMB',
        display: 'ambulatory'
      },

      subject: {
        reference: `Patient/${this.patientId}`
      },

      type: [{
        text: values.visitType === 'telehealth'
          ? 'Telehealth Visit'
          : 'Office Visit'
      }],

      period: {
        start: start.toISOString()
      }
    };

    this.saving.set(true);
    this.error.set('');

    this.encounterService.createEncounter(encounter).subscribe({
      next: () => {
        this.router.navigate([
          '/patients',
          this.patientId,
          'encounters'
        ]);
      },
      error: err => {
        console.error('Encounter creation failed:', err);
        this.error.set('Unable to create encounter.');
        this.saving.set(false);
      }
    });
  }
}

