import { TestBed } from '@angular/core/testing';

import { Patientmessage } from './patientmessage';

describe('Patientmessage', () => {
  let service: Patientmessage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Patientmessage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
