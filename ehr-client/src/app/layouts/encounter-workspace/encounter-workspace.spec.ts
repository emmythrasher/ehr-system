import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EncounterWorkspace } from './encounter-workspace';

describe('EncounterWorkspace', () => {
  let component: EncounterWorkspace;
  let fixture: ComponentFixture<EncounterWorkspace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncounterWorkspace],
    }).compileComponents();

    fixture = TestBed.createComponent(EncounterWorkspace);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
