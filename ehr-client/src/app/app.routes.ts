import { Routes } from '@angular/router';
import { Patients } from './pages/patients/patients';
import { PatientCreate } from './pages/patient-create/patient-create';
import { PatientDetail } from './pages/patient-detail/patient-detail';
import { PatientEdit } from './pages/patient-edit/patient-edit';
import { PatientConditions } from './pages/patient-conditions/patient-conditions';
import { ConditionCreate } from './pages/condition-create/condition-create';
import { ConditionEdit } from './pages/condition-edit/condition-edit';

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
    component: PatientDetail
  },
  {
    path: 'patients/:id/edit',
    component: PatientEdit
  },
  {
    path: 'patients/:id/conditions',
    component: PatientConditions
  },
  {
    path: 'patients/:id/conditions/new',
    component: ConditionCreate
  },
  {
    path: 'patients/:id/conditions/:conditionId/edit',
    component: ConditionEdit
  }
];
