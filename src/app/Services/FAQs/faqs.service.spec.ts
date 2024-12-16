import { TestBed } from '@angular/core/testing';

import { FAQsService } from './faqs.service';

describe('FAQsService', () => {
  let service: FAQsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FAQsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
