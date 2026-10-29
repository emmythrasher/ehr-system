
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FhirCondition {
  resourceType: 'Condition';
  id?: string;
  meta?: { versionId?: string };
  clinicalStatus?: {
    coding?: {
      system?: string;
      code?: string;
      display?: string;
    }[];
  };
  category?: {
    coding?: {
      system?: string;
      code?: string;
    }[];
  }[];
  code?: {
    coding?: {
      system?: string;
      code?: string;
      display?: string;
    }[];
    text?: string;
  };
  subject: {
    reference: string;
  };
  onsetDateTime?: string;
  recordedDate?: string;
}

export interface ConditionBundle {
  resourceType: 'Bundle';
  entry?: { resource: FhirCondition }[];
  total?: number;
  link?: { relation: string; url: string }[];
}

@Injectable({ providedIn: 'root' })
export class ConditionService {
  private http = inject(HttpClient);
  private readonly apiUrl = '/fhir/Condition';

  getConditions(patientId: string): Observable<ConditionBundle> {
    const params = new HttpParams()
      .set('patient', patientId)
      .set('_count', '50');

    return this.http.get<ConditionBundle>(
      this.apiUrl,
      { params }
    );
  }

  getConditionById(id: string): Observable<FhirCondition> {
    return this.http.get<FhirCondition>(
      `${this.apiUrl}/${encodeURIComponent(id)}`
    );
  }

  createCondition(
    condition: FhirCondition
  ): Observable<FhirCondition> {
    return this.http.post<FhirCondition>(
      this.apiUrl,
      condition,
      {
        headers: {
          'Content-Type': 'application/fhir+json',
          'Accept': 'application/fhir+json'
        }
      }
    );
  }

  updateCondition(
    id: string,
    condition: FhirCondition
  ): Observable<FhirCondition> {
    return this.http.put<FhirCondition>(
      `${this.apiUrl}/${encodeURIComponent(id)}`,
      condition,
      {
        headers: {
          'Content-Type': 'application/fhir+json',
          'Accept': 'application/fhir+json'
        }
      }
    );
  }
}

