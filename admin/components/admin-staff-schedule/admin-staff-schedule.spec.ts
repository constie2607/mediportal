import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStaffSchedule } from './admin-staff-schedule';

describe('AdminStaffSchedule', () => {
  let component: AdminStaffSchedule;
  let fixture: ComponentFixture<AdminStaffSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminStaffSchedule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminStaffSchedule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
