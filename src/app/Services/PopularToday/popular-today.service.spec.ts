import { TestBed } from '@angular/core/testing';

import { PopularTodayService } from './popular-today.service';

describe('PopularTodayService', () => {
  let service: PopularTodayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopularTodayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
