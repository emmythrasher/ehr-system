import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientWorkspace } from './patient-workspace';

describe('PatientWorkspace', () => {
  let component: PatientWorkspace;
  let fixture: ComponentFixture<PatientWorkspace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientWorkspace],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientWorkspace);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
