
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FhirEncounter {
  resourceType: 'Encounter';
  id?: string;
  status: string;

  class: {
    system: string;
    code: string;
    display?: string;
  };

  subject: {
    reference: string;
  };

  period?: {
    start?: string;
    end?: string;
  };

  type?: {
    coding?: {
      system?: string;
      code?: string;
      display?: string;
    }[];
    text?: string;
  }[];
}

export interface EncounterBundle {
  resourceType: 'Bundle';
  total?: number;
  entry?: {
    resource: FhirEncounter;
  }[];
  link?: {
    relation: string;
    url: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class EncounterService {
  private http = inject(HttpClient);
  private apiUrl = '/fhir/Encounter';

  createEncounter(
    encounter: FhirEncounter
  ): Observable<FhirEncounter> {
    return this.http.post<FhirEncounter>(
      this.apiUrl,
      encounter,
      {
        headers: {
          'Content-Type': 'application/fhir+json',
          'Accept': 'application/fhir+json'
        }
      }
    );
  }

  getEncounters(patientId: string): Observable<EncounterBundle> {
    const params = new HttpParams()
      .set('patient', patientId)
      .set('_count', '50');

    return this.http.get<EncounterBundle>(
      this.apiUrl,
      { params }
    );
  }

  getEncounterById(id: string): Observable<FhirEncounter> {
    return this.http.get<FhirEncounter>(
      `${this.apiUrl}/${encodeURIComponent(id)}`
    );
  }
}
