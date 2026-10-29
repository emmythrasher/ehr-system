import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EncounterCreate } from './encounter-create';

describe('EncounterCreate', () => {
  let component: EncounterCreate;
  let fixture: ComponentFixture<EncounterCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncounterCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(EncounterCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
