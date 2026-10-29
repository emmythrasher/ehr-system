
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  PatientService,
  FhirPatient
} from '../../services/patient';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './patients.html',
  styleUrl: './patients.scss'
})
export class Patients implements OnInit {
  private patientService = inject(PatientService);

  patients = signal<FhirPatient[]>([]);
  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.loading.set(true);
    this.error.set('');

    this.patientService.getPatients().subscribe({
      next: (bundle) => {
        const patientList = (bundle.entry ?? [])
          .map(entry => entry.resource)
          .filter(resource => resource.resourceType === 'Patient');

        this.patients.set(patientList);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('FHIR request failed:', err);
        this.error.set('Unable to load patients.');
        this.loading.set(false);
      }
    });
  }

  getPatientName(patient: FhirPatient): string {
    const name = patient.name?.[0];

    if (!name) return 'Unknown';

    const given = name.given?.join(' ') ?? '';
    const family = name.family ?? '';

    return `${given} ${family}`.trim() || 'Unknown';
  }
}
