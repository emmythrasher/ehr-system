
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import {
  ObservationService,
  FhirObservation
} from '../../services/observation';

@Component({
  selector: 'app-encounter-vitals',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './encounter-vitals.html',
  styleUrl: './encounter-vitals.scss'
})
export class EncounterVitals implements OnInit {
  private route = inject(ActivatedRoute);
  private observationService = inject(ObservationService);

  patientId = this.route.parent?.parent?.snapshot.paramMap.get('id') ?? '';
  encounterId =
    this.route.parent?.snapshot.paramMap.get('encounterId') ?? '';

  observations = signal<FhirObservation[]>([]);
  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    if (!this.patientId || !this.encounterId) {
      this.error.set('Patient or encounter ID is missing.');
      return;
    }

    this.loadVitals();
  }

  loadVitals(): void {
    this.loading.set(true);
    this.error.set('');

    this.observationService
      .getVitals(this.patientId, this.encounterId)
      .subscribe({
        next: bundle => {
          this.observations.set(
            (bundle.entry ?? []).map(entry => entry.resource)
          );
          this.loading.set(false);
        },
        error: err => {
          console.error('Failed to load vitals:', err);
          this.error.set('Unable to load vital signs.');
          this.loading.set(false);
        }
      });
  }

  getName(observation: FhirObservation): string {
    return observation.code.text
      || observation.code.coding?.[0]?.display
      || 'Unknown measurement';
  }

  getValue(observation: FhirObservation): string {
    const quantity = observation.valueQuantity;

    if (quantity?.value !== undefined) {
      return `${quantity.value} ${quantity.unit ?? ''}`.trim();
    }

    // Blood pressure uses components rather than valueQuantity.
    const components = observation.component ?? [];

    const systolic = components.find(component =>
      component.code.coding?.some(coding => coding.code === '8480-6')
    );

    const diastolic = components.find(component =>
      component.code.coding?.some(coding => coding.code === '8462-4')
    );

    if (systolic?.valueQuantity?.value !== undefined &&
      diastolic?.valueQuantity?.value !== undefined) {
      return `${systolic.valueQuantity.value}/${diastolic.valueQuantity.value} mmHg`;
    }

    return '—';
  }
}

