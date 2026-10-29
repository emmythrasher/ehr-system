
import { Component, inject, OnInit, signal } from '@angular/core';
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
  selector: 'app-condition-edit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './condition-edit.html',
  styleUrl: './condition-edit.scss'
})
export class ConditionEdit implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private conditionService = inject(ConditionService);

  patientId = this.route.snapshot.paramMap.get('id') ?? '';
  conditionId = this.route.snapshot.paramMap.get('conditionId') ?? '';

  condition = signal<FhirCondition | null>(null);
  loading = signal(true);
  saving = signal(false);
  error = signal('');

  form = this.fb.nonNullable.group({
    clinicalStatus: ['active', Validators.required],
    onsetDate: ['']
  });

  ngOnInit(): void {
    if (!this.patientId || !this.conditionId) {
      this.error.set('Patient or condition ID is missing.');
      this.loading.set(false);
      return;
    }

    this.conditionService.getConditionById(this.conditionId).subscribe({
      next: condition => {
        if (condition.subject.reference !== `Patient/${this.patientId}`) {
          this.error.set('Condition does not belong to this patient.');
          this.loading.set(false);
          return;
        }

        this.condition.set(condition);

        this.form.patchValue({
          clinicalStatus: condition.clinicalStatus?.coding?.[0]?.code ?? 'active',
          onsetDate: condition.onsetDateTime?.substring(0, 10) ?? ''
        });

        this.loading.set(false);
      },
      error: err => {
        console.error(err);
        this.error.set('Unable to load condition.');
        this.loading.set(false);
      }
    });
  }

  save(): void {
    const existing = this.condition();

    if (!existing?.id || this.form.invalid || this.saving()) {
      return;
    }

    const values = this.form.getRawValue();

    const updated: FhirCondition = {
      ...existing,
      clinicalStatus: {
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
          code: values.clinicalStatus
        }]
      },
      ...(values.onsetDate
        ? { onsetDateTime: values.onsetDate }
        : { onsetDateTime: undefined })
    };

    this.saving.set(true);
    this.error.set('');

    this.conditionService.updateCondition(existing.id, updated).subscribe({
      next: () => {
        this.router.navigate(['/patients', this.patientId, 'conditions']);
      },
      error: err => {
        console.error(err);
        this.error.set('Unable to save changes.');
        this.saving.set(false);
      }
    });
  }
}

