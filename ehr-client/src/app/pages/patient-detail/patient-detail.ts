
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PatientService, FhirPatient } from '../../services/patient';
import { ConditionService, FhirCondition } from '../../services/condition';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './patient-detail.html',
  styleUrl: './patient-detail.scss'
})
export class PatientDetail implements OnInit {

  private route = inject(ActivatedRoute);
  private patientService = inject(PatientService);

  patient = signal<FhirPatient | null>(null);
  loading = signal(false);
  error = signal('');

  private conditionService = inject(ConditionService);

  conditions = signal<FhirCondition[]>([]);
  conditionsLoading = signal(false);
  conditionsError = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loadPatient(id);
    } else {
      this.error.set('Patient ID was not provided.');
    }
  }

  loadPatient(id: string): void {
    this.loading.set(true);
    this.error.set('');

    this.patientService.getPatientById(id).subscribe({
      next: (patient) => {
        this.patient.set(patient);
        this.loading.set(false);

        if (patient.id) {
          this.loadConditions(patient.id);
        }
      },
      error: (err) => {
        console.error('Failed to retrieve patient:', err);
        this.error.set('Unable to load patient record.');
        this.loading.set(false);
      }
    });
  }

  getPatientName(patient: FhirPatient): string {
    const name = patient.name?.[0];

    if (!name) return 'Unknown Patient';

    const given = name.given?.join(' ') ?? '';
    const family = name.family ?? '';

    return `${given} ${family}`.trim() || 'Unknown Patient';
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

  getConditionName(condition: FhirCondition): string {
    return condition.code?.text
      || condition.code?.coding?.[0]?.display
      || 'Unnamed condition';
  }

  getConditionStatus(condition: FhirCondition): string {
    return condition.clinicalStatus?.coding?.[0]?.code ?? 'Unknown';
  }
}
