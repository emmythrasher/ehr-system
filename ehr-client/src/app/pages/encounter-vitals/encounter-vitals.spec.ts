import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EncounterVitals } from './encounter-vitals';

describe('EncounterVitals', () => {
  let component: EncounterVitals;
  let fixture: ComponentFixture<EncounterVitals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncounterVitals],
    }).compileComponents();

    fixture = TestBed.createComponent(EncounterVitals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
