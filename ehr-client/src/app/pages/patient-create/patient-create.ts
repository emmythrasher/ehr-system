
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  Router,
  RouterLink
} from '@angular/router';
import { PatientService, FhirPatient } from '../../services/patient';

@Component({
  selector: 'app-patient-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-create.html',
  styleUrl: './patient-create.scss'
})
export class PatientCreate {
  private fb = inject(FormBuilder);
  private patientService = inject(PatientService);
  private router = inject(Router);

  saving = false;
  error = '';

  patientForm = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    birthDate: ['', Validators.required],
    gender: ['unknown', Validators.required]
  });

  savePatient(): void {
    if (this.patientForm.invalid || this.saving) {
      this.patientForm.markAllAsTouched();
      return;
    }

    const values = this.patientForm.getRawValue();

    const patient: FhirPatient = {
      resourceType: 'Patient',
      name: [{
        given: [values.firstName.trim()],
        family: values.lastName.trim()
      }],
      birthDate: values.birthDate,
      gender: values.gender
    };

    this.saving = true;
    this.error = '';

    this.patientService.createPatient(patient).subscribe({
      next: () => {
        this.router.navigate(['/patients']);
      },
      error: (err) => {
        console.error('Failed to save patient:', err);
        this.error = 'Unable to create patient.';
        this.saving = false;
      }
    });
  }
}

