
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  EncounterService,
  FhirEncounter
} from '../../services/encounter';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-patient-encounters',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './patient-encounters.html',
  styleUrl: './patient-encounters.scss'
})
export class PatientEncounters implements OnInit {

  private route = inject(ActivatedRoute);
  private encounterService = inject(EncounterService);

  encounters = signal<FhirEncounter[]>([]);
  loading = signal(false);
  error = signal('');

  patientId = this.route.parent?.snapshot.paramMap.get('id') ?? '';

  ngOnInit(): void {
    if (!this.patientId) {
      this.error.set('Patient ID is missing.');
      return;
    }

    this.loadEncounters(this.patientId);
  }

  loadEncounters(patientId: string): void {
    this.loading.set(true);
    this.error.set('');

    this.encounterService.getEncounters(patientId).subscribe({
      next: bundle => {
        this.encounters.set(
          (bundle.entry ?? []).map(entry => entry.resource)
        );

        this.loading.set(false);
      },
      error: err => {
        console.error('Failed to load encounters:', err);
        this.error.set('Unable to load encounter history.');
        this.loading.set(false);
      }
    });
  }

  getEncounterType(encounter: FhirEncounter): string {
    return encounter.type?.[0]?.text
      || encounter.type?.[0]?.coding?.[0]?.display
      || encounter.class.display
      || encounter.class.code;
  }
}

