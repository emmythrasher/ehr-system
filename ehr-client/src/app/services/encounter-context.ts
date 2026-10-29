
import { Injectable, computed, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { EncounterService, FhirEncounter } from './encounter';

@Injectable()
export class EncounterContextService {
  private encounterService = inject(EncounterService);
  private activeRequest?: Subscription;

  private _encounter = signal<FhirEncounter | null>(null);
  private _loading = signal(false);
  private _error = signal('');

  readonly encounter = this._encounter.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly visitType = computed(() => {
    const e = this._encounter();

    return e?.type?.[0]?.text
      || e?.type?.[0]?.coding?.[0]?.display
      || e?.class?.display
      || e?.class?.code
      || 'Clinical Visit';
  });

  loadEncounter(id: string, patientId: string): void {
    this.activeRequest?.unsubscribe();

    this._encounter.set(null);
    this._loading.set(true);
    this._error.set('');

    this.activeRequest =
      this.encounterService.getEncounterById(id).subscribe({
        next: encounter => {
          if (encounter.subject?.reference !== `Patient/${patientId}`) {
            this._error.set('Encounter does not belong to this patient.');
          } else {
            this._encounter.set(encounter);
          }

          this._loading.set(false);
        },
        error: err => {
          console.error('Encounter retrieval failed:', err);
          this._error.set('Unable to retrieve encounter.');
          this._loading.set(false);
        }
      });
  }

  clear(): void {
    this.activeRequest?.unsubscribe();
    this._encounter.set(null);
    this._loading.set(false);
    this._error.set('');
  }
}

