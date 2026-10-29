
import { Injectable, inject, signal, computed } from '@angular/core';
import { PatientService, FhirPatient } from './patient';
import { Subscription } from 'rxjs';

@Injectable()
export class PatientContextService {

  private activeRequest?: Subscription;
  private patientService = inject(PatientService);

  private readonly _patient = signal<FhirPatient | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal('');

  readonly patient = this._patient.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly patientName = computed(() => {
    const patient = this._patient();
    const name = patient?.name?.[0];

    if (!name) return 'Unknown Patient';

    return [
      ...(name.given ?? []),
      name.family ?? ''
    ].filter(Boolean).join(' ');
  });


  loadPatient(id: string): void {
    // Cancel any previous unfinished patient request.
    this.activeRequest?.unsubscribe();

    // Clear the previously selected patient's information.
    this._patient.set(null);
    this._loading.set(true);
    this._error.set('');

    this.activeRequest =
      this.patientService.getPatientById(id).subscribe({
        next: patient => {
          this._patient.set(patient);
          this._loading.set(false);
        },
        error: err => {
          console.error('Failed to load patient:', err);

          this._error.set('Unable to load patient.');
          this._loading.set(false);
        }
      });
  }

  clearPatient(): void {
    this.activeRequest?.unsubscribe();
    this._patient.set(null);
    this._loading.set(false);
    this._error.set('Patient ID is missing.');
  }
}

