
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  ConditionService,
  FhirCondition
} from '../../services/condition';

@Component({
  selector: 'app-patient-conditions',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './patient-conditions.html',
  styleUrl: './patient-conditions.scss'
})
export class PatientConditions implements OnInit {
  private route = inject(ActivatedRoute);
  private conditionService = inject(ConditionService);

  patientId = '';
  conditions = signal<FhirCondition[]>([]);
  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id') ?? '';

    if (this.patientId) {
      this.loadConditions();
    } else {
      this.error.set('Patient ID is missing.');
    }
  }

  loadConditions(): void {
    this.loading.set(true);
    this.error.set('');

    this.conditionService.getConditions(this.patientId).subscribe({
      next: (bundle) => {
        this.conditions.set(
          (bundle.entry ?? []).map(entry => entry.resource)
        );
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Unable to load conditions.');
        this.loading.set(false);
      }
    });
  }

  getConditionName(condition: FhirCondition): string {
    return condition.code?.text
      || condition.code?.coding?.[0]?.display
      || 'Unnamed condition';
  }

  getConditionCode(condition: FhirCondition): string {
    return condition.code?.coding?.[0]?.code ?? '—';
  }

  getClinicalStatus(condition: FhirCondition): string {
    return condition.clinicalStatus?.coding?.[0]?.code ?? 'Unknown';
  }
}

