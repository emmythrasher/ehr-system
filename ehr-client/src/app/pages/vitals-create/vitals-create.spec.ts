import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VitalsCreate } from './vitals-create';

describe('VitalsCreate', () => {
  let component: VitalsCreate;
  let fixture: ComponentFixture<VitalsCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VitalsCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(VitalsCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
