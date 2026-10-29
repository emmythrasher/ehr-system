
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  ConditionService,
  FhirCondition
} from '../../services/condition';

@Component({
  selector: 'app-condition-create',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './condition-create.html',
  styleUrl: './condition-create.scss'
})
export class ConditionCreate {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private conditionService = inject(ConditionService);

  patientId = this.route.snapshot.paramMap.get('id') ?? '';
  saving = signal(false);
  error = signal('');

  conditionForm = this.fb.nonNullable.group({
    diagnosis: ['', Validators.required],
    code: ['', Validators.required],
    clinicalStatus: ['active', Validators.required],
    onsetDate: ['']
  });

  saveCondition(): void {
    if (!this.patientId || this.conditionForm.invalid || this.saving()) {
      this.conditionForm.markAllAsTouched();
      return;
    }

    const values = this.conditionForm.getRawValue();

    const condition: FhirCondition = {
      resourceType: 'Condition',
      subject: {
        reference: `Patient/${this.patientId}`
      },
      clinicalStatus: {
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
          code: values.clinicalStatus
        }]
      },
      category: [{
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/condition-category',
          code: 'problem-list-item'
        }]
      }],
      code: {
        coding: [{
          system: 'http://hl7.org/fhir/sid/icd-10-cm',
          code: values.code.trim().toUpperCase(),
          display: values.diagnosis.trim()
        }],
        text: values.diagnosis.trim()
      },
      recordedDate: new Date().toISOString(),
      ...(values.onsetDate
        ? { onsetDateTime: values.onsetDate }
        : {})
    };

    this.saving.set(true);
    this.error.set('');

    this.conditionService.createCondition(condition).subscribe({
      next: () => {
        this.router.navigate([
          '/patients',
          this.patientId,
          'conditions'
        ]);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Unable to save condition.');
        this.saving.set(false);
      }
    });
  }
}
