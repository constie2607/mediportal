import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientMedicalHistory } from './patient-medical-history';

describe('PatientMedicalHistory', () => {
  let component: PatientMedicalHistory;
  let fixture: ComponentFixture<PatientMedicalHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientMedicalHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientMedicalHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
