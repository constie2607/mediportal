import { TestBed } from '@angular/core/testing';

import { AdminProfile } from './admin-profile';

describe('AdminProfile', () => {
  let service: AdminProfile;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminProfile);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
