import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientMedication } from './patient-medication';

describe('PatientMedication', () => {
  let component: PatientMedication;
  let fixture: ComponentFixture<PatientMedication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientMedication]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientMedication);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
