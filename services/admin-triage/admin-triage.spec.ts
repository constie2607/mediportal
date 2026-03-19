import { TestBed } from '@angular/core/testing';

import { AdminTriage } from './admin-triage';

describe('AdminTriage', () => {
  let service: AdminTriage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminTriage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
