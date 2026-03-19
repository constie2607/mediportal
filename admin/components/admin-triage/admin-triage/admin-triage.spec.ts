import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTriage } from './admin-triage';

describe('AdminTriage', () => {
  let component: AdminTriage;
  let fixture: ComponentFixture<AdminTriage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTriage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTriage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
