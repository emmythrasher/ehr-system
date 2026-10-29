
import {
  Component,
  DestroyRef,
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

import { combineLatest } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EncounterContextService } from '../../services/encounter-context';

@Component({
  selector: 'app-encounter-workspace',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  providers: [EncounterContextService],
  templateUrl: './encounter-workspace.html',
  styleUrl: './encounter-workspace.scss'
})
export class EncounterWorkspace implements OnInit {
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  readonly context = inject(EncounterContextService);

  patientId = signal('');
  encounterId = signal('');

  encounter = this.context.encounter;
  loading = this.context.loading;
  error = this.context.error;
  visitType = this.context.visitType;

  ngOnInit(): void {
    const patientRoute = this.route.parent;

    if (!patientRoute) {
      return;
    }

    combineLatest([
      patientRoute.paramMap,
      this.route.paramMap
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([patientParams, encounterParams]) => {
        const patientId = patientParams.get('id') ?? '';
        const encounterId = encounterParams.get('encounterId') ?? '';

        this.patientId.set(patientId);
        this.encounterId.set(encounterId);

        if (patientId && encounterId) {
          this.context.loadEncounter(encounterId, patientId);
        } else {
          this.context.clear();
        }
      });
  }
}

