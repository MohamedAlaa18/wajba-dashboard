import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailsPosComponent } from './order-details-pos.component';

describe('OrderDetailsPosComponent', () => {
  let component: OrderDetailsPosComponent;
  let fixture: ComponentFixture<OrderDetailsPosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDetailsPosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderDetailsPosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
