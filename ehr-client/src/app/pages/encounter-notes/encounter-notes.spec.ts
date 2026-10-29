import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EncounterNotes } from './encounter-notes';

describe('EncounterNotes', () => {
  let component: EncounterNotes;
  let fixture: ComponentFixture<EncounterNotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncounterNotes],
    }).compileComponents();

    fixture = TestBed.createComponent(EncounterNotes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
