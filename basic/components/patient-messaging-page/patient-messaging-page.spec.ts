import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientMessagingPage } from './patient-messaging-page';

describe('PatientMessagingPage', () => {
  let component: PatientMessagingPage;
  let fixture: ComponentFixture<PatientMessagingPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientMessagingPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientMessagingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
