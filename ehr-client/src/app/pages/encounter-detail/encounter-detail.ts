
import { Component, inject, OnInit, signal } from '@angular/core';

import { EncounterContextService } from '../../services/encounter-context';
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
  private context = inject(EncounterContextService);
  private observationService = inject(ObservationService);

  encounter = this.context.encounter;
  loading = this.context.loading;
  error = this.context.error;

  vitals = signal<FhirObservation[]>([]);
  vitalsLoading = signal(false);
  vitalsError = signal('');

  ngOnInit(): void {
    const encounter = this.encounter();
    const encounterId = encounter?.id;

    const patientId =
      encounter?.subject?.reference?.match(/^Patient\/([^/]+)$/)?.[1];

    if (patientId && encounterId) {
      this.loadVitals(patientId, encounterId);
    }
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

