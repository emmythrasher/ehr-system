
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Represents a coded clinical concept.
export interface FhirCoding {
  system?: string;
  code?: string;
  display?: string;
}

export interface FhirCodeableConcept {
  coding?: FhirCoding[];
  text?: string;
}

// Represents a number with standardized units.
export interface FhirQuantity {
  value?: number;
  unit?: string;
  system?: string;
  code?: string;
}

// Represents a reference to another FHIR resource.
export interface FhirReference {
  reference: string;
}

// Represents an individual clinical observation.
export interface FhirObservation {
  resourceType: 'Observation';
  id?: string;
  status: string;
  category?: FhirCodeableConcept[];
  code: FhirCodeableConcept;
  subject: FhirReference;
  encounter?: FhirReference;
  effectiveDateTime?: string;
  valueQuantity?: FhirQuantity;

  component?: {
    code: FhirCodeableConcept;
    valueQuantity?: FhirQuantity;
  }[];
}

// Represents FHIR search results.
export interface ObservationBundle {
  resourceType: 'Bundle';
  total?: number;
  entry?: {
    resource: FhirObservation;
  }[];
  link?: {
    relation: string;
    url: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ObservationService {
  private http = inject(HttpClient);

  private readonly apiUrl = '/fhir/Observation';

  getVitals(
    patientId: string,
    encounterId: string
  ): Observable<ObservationBundle> {

    const params = new HttpParams()
      .set('patient', patientId)
      .set('encounter', encounterId)
      .set('category', 'vital-signs')
      .set('_count', '50');

    return this.http.get<ObservationBundle>(
      this.apiUrl,
      { params }
    );
  }

  createObservation(
    observation: FhirObservation
  ): Observable<FhirObservation> {

    return this.http.post<FhirObservation>(
      this.apiUrl,
      observation,
      {
        headers: {
          'Content-Type': 'application/fhir+json',
          'Accept': 'application/fhir+json'
        }
      }
    );
  }
}

