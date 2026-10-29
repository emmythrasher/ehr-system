import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConditionCreate } from './condition-create';

describe('ConditionCreate', () => {
  let component: ConditionCreate;
  let fixture: ComponentFixture<ConditionCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConditionCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(ConditionCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
