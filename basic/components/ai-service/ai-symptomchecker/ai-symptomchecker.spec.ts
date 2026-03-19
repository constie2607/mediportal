import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiSymptomchecker } from './ai-symptomchecker';

describe('AiSymptomchecker', () => {
  let component: AiSymptomchecker;
  let fixture: ComponentFixture<AiSymptomchecker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiSymptomchecker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiSymptomchecker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
