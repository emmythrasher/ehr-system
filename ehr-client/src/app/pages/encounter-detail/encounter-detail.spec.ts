import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EncounterDetail } from './encounter-detail';

describe('EncounterDetail', () => {
  let component: EncounterDetail;
  let fixture: ComponentFixture<EncounterDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncounterDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(EncounterDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
