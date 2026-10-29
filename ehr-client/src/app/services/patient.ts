
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// FHIR Patient resource
export interface FhirPatient {
  resourceType: 'Patient';
  id?: string;
  name?: {
    given?: string[];
    family?: string;
  }[];
  birthDate?: string;
  gender?: string;
}

// FHIR search result
export interface PatientBundle {
  resourceType: 'Bundle';
  total?: number;
  entry?: {
    resource: FhirPatient;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private http = inject(HttpClient);
  private apiUrl = '/fhir/Patient';

  // Retrieve patients
  getPatients(): Observable<PatientBundle> {
    const params = new HttpParams().set('_count', '50');

    return this.http.get<PatientBundle>(
      this.apiUrl,
      { params }
    );
  }

  getPatientById(id: string): Observable<FhirPatient> {
    return this.http.get<FhirPatient>(
      `${this.apiUrl}/${encodeURIComponent(id)}`
    );
  }

  // Create a patient
  createPatient(patient: FhirPatient): Observable<FhirPatient> {
    return this.http.post<FhirPatient>(
      this.apiUrl,
      patient,
      {
        headers: {
          'Content-Type': 'application/fhir+json',
          'Accept': 'application/fhir+json'
        }
      }
    );
  }

  updatePatient(
    id: string,
    patient: FhirPatient
  ): Observable<FhirPatient> {
    return this.http.put<FhirPatient>(
      `${this.apiUrl}/${encodeURIComponent(id)}`,
      patient,
      {
        headers: {
          'Content-Type': 'application/fhir+json',
          'Accept': 'application/fhir+json'
        }
      }
    );
  }
}
