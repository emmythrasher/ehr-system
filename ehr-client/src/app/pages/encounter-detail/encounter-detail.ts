
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  EncounterService,
  FhirEncounter
} from '../../services/encounter';

@Component({
  selector: 'app-encounter-detail',
  standalone: true,
  imports: [],
  templateUrl: './encounter-detail.html',
  styleUrl: './encounter-detail.scss'
})
export class EncounterDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private encounterService = inject(EncounterService);

  encounter = signal<FhirEncounter | null>(null);
  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    const id = this.route.parent?.snapshot.paramMap.get('encounterId');

    if (!id) {
      this.error.set('Encounter ID is missing.');
      this.loading.set(false);
      return;
    }

    this.encounterService.getEncounterById(id).subscribe({
      next: encounter => {
        this.encounter.set(encounter);
        this.loading.set(false);
      },
      error: err => {
        console.error(err);
        this.error.set('Unable to load encounter details.');
        this.loading.set(false);
      }
    });
  }
}

