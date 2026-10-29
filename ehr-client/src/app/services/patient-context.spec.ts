import { TestBed } from '@angular/core/testing';
import { PatientContext } from './patient-context';

describe('PatientContext', () => {
  let service: PatientContext;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientContext);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
