
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PatientContextService } from '../../services/patient-context';
import {
  ConditionService,
  FhirCondition
} from '../../services/condition';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './patient-detail.html',
  styleUrl: './patient-detail.scss'
})
export class PatientDetail implements OnInit {

  private context = inject(PatientContextService);
  private conditionService = inject(ConditionService);

  // Shared patient state
  patient = this.context.patient;
  loading = this.context.loading;
  error = this.context.error;

  // Independent clinical module state
  conditions = signal<FhirCondition[]>([]);
  conditionsLoading = signal(false);
  conditionsError = signal('');

  ngOnInit(): void {
    const id = this.patient()?.id;

    if (id) {
      this.loadConditions(id);
    }
  }

  loadConditions(patientId: string): void {
    this.conditionsLoading.set(true);
    this.conditionsError.set('');

    this.conditionService.getConditions(patientId).subscribe({
      next: bundle => {
        this.conditions.set(
          (bundle.entry ?? []).map(entry => entry.resource)
        );

        this.conditionsLoading.set(false);
      },
      error: err => {
        console.error('Failed to load conditions:', err);

        this.conditionsError.set('Unable to load problem list.');
        this.conditionsLoading.set(false);
      }
    });
  }

  getPatientName(): string {
    return this.context.patientName();
  }

  getConditionName(condition: FhirCondition): string {
    return condition.code?.text
      || condition.code?.coding?.[0]?.display
      || 'Unnamed condition';
  }

  getConditionStatus(condition: FhirCondition): string {
    return condition.clinicalStatus?.coding?.[0]?.code
      ?? 'Unknown';
  }
}

