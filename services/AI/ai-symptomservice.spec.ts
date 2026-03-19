import { TestBed } from '@angular/core/testing';

import { AiSymptomservice } from './ai-symptomservice';

describe('AiSymptomservice', () => {
  let service: AiSymptomservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiSymptomservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
