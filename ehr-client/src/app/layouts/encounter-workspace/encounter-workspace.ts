
import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import {
  EncounterService,
  FhirEncounter
} from '../../services/encounter';

@Component({
  selector: 'app-encounter-workspace',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './encounter-workspace.html',
  styleUrl: './encounter-workspace.scss'
})
export class EncounterWorkspace implements OnInit {
  private route = inject(ActivatedRoute);
  private encounterService = inject(EncounterService);

  patientId = this.route.parent?.snapshot.paramMap.get('id') ?? '';
  encounterId = this.route.snapshot.paramMap.get('encounterId') ?? '';

  encounter = signal<FhirEncounter | null>(null);
  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    if (!this.patientId || !this.encounterId) {
      this.error.set('Patient or encounter ID is missing.');
      this.loading.set(false);
      return;
    }

    this.encounterService.getEncounterById(this.encounterId)
      .subscribe({
        next: encounter => {
          if (encounter.subject?.reference !== `Patient/${this.patientId}`) {
            this.error.set('Encounter does not belong to this patient.');
          } else {
            this.encounter.set(encounter);
          }

          this.loading.set(false);
        },
        error: err => {
          console.error('Failed to retrieve encounter:', err);
          this.error.set('Unable to load encounter.');
          this.loading.set(false);
        }
      });
  }

  getVisitType(encounter: FhirEncounter): string {
    return encounter.type?.[0]?.text
      || encounter.type?.[0]?.coding?.[0]?.display
      || encounter.class?.display
      || encounter.class?.code
      || 'Clinical Visit';
  }
}

