import { TestBed } from '@angular/core/testing';

import { OrderSetupService } from './order-setup.service';

describe('OrderSetupService', () => {
  let service: OrderSetupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderSetupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
