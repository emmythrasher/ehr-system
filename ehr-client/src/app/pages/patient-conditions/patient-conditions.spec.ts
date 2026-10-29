import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientConditions } from './patient-conditions';

describe('PatientConditions', () => {
  let component: PatientConditions;
  let fixture: ComponentFixture<PatientConditions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientConditions],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientConditions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
