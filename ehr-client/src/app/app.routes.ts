
import { Routes } from '@angular/router';

import { Patients } from './pages/patients/patients';
import { PatientCreate } from './pages/patient-create/patient-create';
import { PatientDetail } from './pages/patient-detail/patient-detail';
import { PatientEdit } from './pages/patient-edit/patient-edit';
import { PatientConditions } from './pages/patient-conditions/patient-conditions';
import { ConditionCreate } from './pages/condition-create/condition-create';
import { ConditionEdit } from './pages/condition-edit/condition-edit';

import { PatientWorkspace } from './layouts/patient-workspace/patient-workspace';

import { PatientEncounters } from './pages/patient-encounters/patient-encounters';
import { EncounterCreate } from './pages/encounter-create/encounter-create';
import { EncounterWorkspace } from './layouts/encounter-workspace/encounter-workspace';
import { EncounterDetail } from './pages/encounter-detail/encounter-detail';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'patients',
    pathMatch: 'full'
  },
  {
    path: 'patients',
    component: Patients
  },
  {
    path: 'patients/new',
    component: PatientCreate
  },
  {
    path: 'patients/:id',
    component: PatientWorkspace,
    children: [
      {
        path: '',
        component: PatientDetail
      },
      {
        path: 'conditions',
        component: PatientConditions
      },
      {
        path: 'conditions/new',
        component: ConditionCreate
      },
      {
        path: 'conditions/:conditionId/edit',
        component: ConditionEdit
      },
      {
        path: 'encounters',
        component: PatientEncounters
      },
      {
        path: 'encounters/new',
        component: EncounterCreate
      },
      {
        path: 'encounters/:encounterId',
        component: EncounterWorkspace,
        children: [
          {
            path: '',
            component: EncounterDetail
          }
        ]
      }
    ]
  },
  {
    path: 'patients/:id/edit',
    component: PatientEdit
  }
];

