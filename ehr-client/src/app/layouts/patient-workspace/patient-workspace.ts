
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

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PatientContextService } from '../../services/patient-context';

@Component({
  selector: 'app-patient-workspace',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  providers: [PatientContextService],
  templateUrl: './patient-workspace.html',
  styleUrl: './patient-workspace.scss'
})
export class PatientWorkspace implements OnInit {

  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  readonly context = inject(PatientContextService);

  patientId = signal('');

  patient = this.context.patient;
  loading = this.context.loading;
  error = this.context.error;
  patientName = this.context.patientName;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const id = params.get('id');

        if (!id) {
          this.patientId.set('');
          this.context.clearPatient();
          return;
        }

        this.patientId.set(id);
        this.context.loadPatient(id);
      });
  }
}
