import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientEncounters } from './patient-encounters';

describe('PatientEncounters', () => {
  let component: PatientEncounters;
  let fixture: ComponentFixture<PatientEncounters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientEncounters],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientEncounters);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
