
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PatientService, FhirPatient } from '../../services/patient';

@Component({
  selector: 'app-patient-edit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './patient-edit.html',
  styleUrl: './patient-edit.scss'
})
export class PatientEdit implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private patientService = inject(PatientService);

  patient = signal<FhirPatient | null>(null);
  loading = signal(true);
  saving = signal(false);
  error = signal('');

  patientForm = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    birthDate: ['', Validators.required],
    gender: ['unknown', Validators.required]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('Patient ID is missing.');
      this.loading.set(false);
      return;
    }

    this.patientService.getPatientById(id).subscribe({
      next: (patient) => {
        this.patient.set(patient);

        this.patientForm.patchValue({
          firstName: patient.name?.[0]?.given?.join(' ') ?? '',
          lastName: patient.name?.[0]?.family ?? '',
          birthDate: patient.birthDate ?? '',
          gender: patient.gender ?? 'unknown'
        });

        this.loading.set(false);
      },
      error: () => {
        this.error.set('Unable to retrieve patient.');
        this.loading.set(false);
      }
    });
  }

  savePatient(): void {
    const existing = this.patient();

    if (!existing?.id || this.patientForm.invalid || this.saving()) {
      this.patientForm.markAllAsTouched();
      return;
    }

    const values = this.patientForm.getRawValue();

    // Preserve existing FHIR fields not shown on the form.
    const updated: FhirPatient = {
      ...existing,
      name: [
        {
          ...existing.name?.[0],
          given: [values.firstName.trim()],
          family: values.lastName.trim()
        },
        ...(existing.name?.slice(1) ?? [])
      ],
      birthDate: values.birthDate,
      gender: values.gender
    };

    this.saving.set(true);
    this.error.set('');

    this.patientService.updatePatient(existing.id, updated).subscribe({
      next: () => {
        this.router.navigate(['/patients', existing.id]);
      },
      error: (err) => {
        console.error('Update failed:', err);
        this.error.set('Unable to update patient.');
        this.saving.set(false);
      }
    });
  }
}

