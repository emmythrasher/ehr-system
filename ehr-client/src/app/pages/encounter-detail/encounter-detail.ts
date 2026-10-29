
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  EncounterService,
  FhirEncounter
} from '../../services/encounter';

import {
  ObservationService,
  FhirObservation
} from '../../services/observation';

@Component({
  selector: 'app-encounter-detail',
  standalone: true,
  imports: [],
  templateUrl: './encounter-detail.html',
  styleUrl: './encounter-detail.scss'
})
export class EncounterDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private encounterService = inject(EncounterService);


  encounter = signal<FhirEncounter | null>(null);
  loading = signal(true);
  error = signal('');

  private observationService = inject(ObservationService);

  vitals = signal<FhirObservation[]>([]);
  vitalsLoading = signal(false);
  vitalsError = signal('');

  ngOnInit(): void {
    const id = this.route.parent?.snapshot.paramMap.get('encounterId');

    if (!id) {
      this.error.set('Encounter ID is missing.');
      this.loading.set(false);
      return;
    }

    this.encounterService.getEncounterById(id).subscribe({
      next: encounter => {
        this.encounter.set(encounter);
        this.loading.set(false);

        const patientId =
          this.route.parent?.parent?.snapshot.paramMap.get('id');

        if (
          patientId &&
          encounter.id &&
          encounter.subject?.reference === `Patient/${patientId}`
        ) {
          this.loadVitals(patientId, encounter.id);
        } else {
          this.vitalsError.set(
            'Encounter does not match the selected patient.'
          );
        }
      },
      error: err => {
        console.error(err);
        this.error.set('Unable to load encounter details.');
        this.loading.set(false);
      }
    });
  }


  loadVitals(patientId: string, encounterId: string): void {
    this.vitalsLoading.set(true);
    this.vitalsError.set('');

    this.observationService.getVitals(patientId, encounterId)
      .subscribe({
        next: bundle => {
          this.vitals.set(
            (bundle.entry ?? []).map(entry => entry.resource)
          );
          this.vitalsLoading.set(false);
        },
        error: err => {
          console.error('Unable to retrieve vitals:', err);
          this.vitalsError.set('Unable to load vital signs.');
          this.vitalsLoading.set(false);
        }
      });
  }

  getVitalName(observation: FhirObservation): string {
    return observation.code.text
      || observation.code.coding?.[0]?.display
      || 'Unknown measurement';
  }

  getVitalValue(observation: FhirObservation): string {
    const quantity = observation.valueQuantity;

    if (quantity?.value !== undefined) {
      return `${quantity.value} ${quantity.unit ?? ''}`.trim();
    }

    const components = observation.component ?? [];

    const systolic = components.find(component =>
      component.code.coding?.some(coding => coding.code === '8480-6')
    );

    const diastolic = components.find(component =>
      component.code.coding?.some(coding => coding.code === '8462-4')
    );

    if (
      systolic?.valueQuantity?.value !== undefined &&
      diastolic?.valueQuantity?.value !== undefined
    ) {
      return `${systolic.valueQuantity.value}/${diastolic.valueQuantity.value} mmHg`;
    }

    return '—';
  }

}

