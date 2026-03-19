import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegPatient } from './reg-patient';

describe('RegPatient', () => {
  let component: RegPatient;
  let fixture: ComponentFixture<RegPatient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegPatient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegPatient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
