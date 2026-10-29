import { TestBed } from '@angular/core/testing';
import { Encounter } from './encounter';

describe('Encounter', () => {
  let service: Encounter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Encounter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
