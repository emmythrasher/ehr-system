import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConditionEdit } from './condition-edit';

describe('ConditionEdit', () => {
  let component: ConditionEdit;
  let fixture: ComponentFixture<ConditionEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConditionEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(ConditionEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
