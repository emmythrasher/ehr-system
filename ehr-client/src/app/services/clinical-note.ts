
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FhirDocumentReference {
  resourceType: 'DocumentReference';
  id?: string;

  status: 'current' | 'superseded' | 'entered-in-error';
  docStatus?: 'preliminary' | 'final' | 'amended' |
    'entered-in-error';

  type?: {
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

  date?: string;

  content: {
    attachment: {
      contentType: string;
      data?: string;
      title?: string;
    };
  }[];

  context?: {
    encounter?: {
      reference: string;
    }[];
  };
}

export interface DocumentBundle {
  resourceType: 'Bundle';
  total?: number;
  entry?: {
    resource: FhirDocumentReference;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ClinicalNoteService {

  private http = inject(HttpClient);

  private readonly apiUrl = '/fhir/DocumentReference';

  getNotes(
    patientId: string,
    encounterId: string
  ): Observable<DocumentBundle> {

    const params = new HttpParams()
      .set('patient', patientId)
      .set('encounter', encounterId)
      .set('_count', '50');

    return this.http.get<DocumentBundle>(
      this.apiUrl,
      { params }
    );
  }

  createNote(
    note: FhirDocumentReference
  ): Observable<FhirDocumentReference> {

    return this.http.post<FhirDocumentReference>(
      this.apiUrl,
      note,
      {
        headers: {
          'Content-Type': 'application/fhir+json',
          'Accept': 'application/fhir+json'
        }
      }
    );
  }
}

