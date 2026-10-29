
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
  ObservationService,
  FhirObservation,
  FhirQuantity
} from '../../services/observation';

const LOINC = 'http://loinc.org';
const UCUM = 'http://unitsofmeasure.org';

const measurements = {
  hr: { code: '8867-4', name: 'Heart rate', unit: '/min', label: 'beats/min' },
  rr: { code: '9279-1', name: 'Respiratory rate', unit: '/min', label: 'breaths/min' },
  temp: { code: '8310-5', name: 'Body temperature', unit: 'Cel', label: '°C' },
  spo2: { code: '2708-6', name: 'Oxygen saturation', unit: '%', label: '%' },
  weight: { code: '29463-7', name: 'Body weight', unit: 'kg', label: 'kg' },
  height: { code: '8302-2', name: 'Body height', unit: 'cm', label: 'cm' }
} as const;

type MeasurementType = keyof typeof measurements | 'bp';

@Component({
  selector: 'app-vitals-create',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './vitals-create.html',
  styleUrl: './vitals-create.scss'
})
export class VitalsCreate {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(ObservationService);

  patientId =
    this.route.parent?.parent?.snapshot.paramMap.get('id') ?? '';

  encounterId =
    this.route.parent?.snapshot.paramMap.get('encounterId') ?? '';

  saving = signal(false);
  error = signal('');

  form = this.fb.nonNullable.group({
    type: 'bp',
    value: '',
    systolic: '',
    diastolic: ''
  });

  private quantity(value: number, unit: string, label: string): FhirQuantity {
    return {
      value,
      unit: label,
      system: UCUM,
      code: unit
    };
  }

  save(): void {
    if (this.saving()) return;

    if (!this.patientId || !this.encounterId) {
      this.error.set('Patient or encounter ID is missing.');
      return;
    }

    const values = this.form.getRawValue();
    const type = values.type as MeasurementType;

    const observation: FhirObservation = {
      resourceType: 'Observation',
      status: 'final',
      category: [{
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/observation-category',
          code: 'vital-signs',
          display: 'Vital Signs'
        }]
      }],
      code: {
        coding: [{
          system: LOINC,
          code: type === 'bp' ? '85354-9' : measurements[type]?.code,
          display: type === 'bp'
            ? 'Blood pressure'
            : measurements[type]?.name
        }]
      },
      subject: { reference: `Patient/${this.patientId}` },
      encounter: { reference: `Encounter/${this.encounterId}` },
      effectiveDateTime: new Date().toISOString()
    };

    if (type === 'bp') {
      const systolic = Number(values.systolic);
      const diastolic = Number(values.diastolic);

      if (
        values.systolic === '' ||
        values.diastolic === '' ||
        !Number.isFinite(systolic) ||
        !Number.isFinite(diastolic) ||
        systolic <= 0 ||
        diastolic <= 0
      ) {
        this.error.set('Enter valid systolic and diastolic values.');
        return;
      }

      observation.component = [
        {
          code: {
            coding: [{
              system: LOINC,
              code: '8480-6',
              display: 'Systolic blood pressure'
            }]
          },
          valueQuantity: this.quantity(systolic, 'mm[Hg]', 'mmHg')
        },
        {
          code: {
            coding: [{
              system: LOINC,
              code: '8462-4',
              display: 'Diastolic blood pressure'
            }]
          },
          valueQuantity: this.quantity(diastolic, 'mm[Hg]', 'mmHg')
        }
      ];
    } else {
      const config = measurements[type];

      if (!config) {
        this.error.set('Invalid measurement type.');
        return;
      }

      const value = Number(values.value);

      if (
        values.value === '' ||
        !Number.isFinite(value) ||
        value <= 0
      ) {
        this.error.set('Enter a positive numeric measurement.');
        return;
      }

      observation.valueQuantity = this.quantity(
        value,
        config.unit,
        config.label
      );
    }

    this.saving.set(true);
    this.error.set('');

    this.service.createObservation(observation).subscribe({
      next: () => {
        this.router.navigate([
          '/patients',
          this.patientId,
          'encounters',
          this.encounterId,
          'vitals'
        ]);
      },
      error: err => {
        console.error('Vital sign save failed:', err);
        this.error.set('Unable to save vital signs.');
        this.saving.set(false);
      }
    });
  }
}

