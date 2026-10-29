import { TestBed } from '@angular/core/testing';
import { ClinicalNote } from './clinical-note';

describe('ClinicalNote', () => {
  let service: ClinicalNote;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClinicalNote);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
