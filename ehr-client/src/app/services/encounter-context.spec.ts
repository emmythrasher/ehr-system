import { TestBed } from '@angular/core/testing';
import { EncounterContext } from './encounter-context';

describe('EncounterContext', () => {
  let service: EncounterContext;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncounterContext);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
