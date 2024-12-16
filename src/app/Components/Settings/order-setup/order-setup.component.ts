import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderSetupService } from '../../../Services/OrderSetup/order-setup.service';

@Component({
  selector: 'app-order-setup',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './order-setup.component.html',
  styleUrls: ['./order-setup.component.scss']
})
export class OrderSetupComponent implements OnInit {
  orderForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private orderSetupService: OrderSetupService
  ) {
    this.orderForm = this.fb.group({
      foodPreparationTime: [null, [Validators.required]],
      orderSlotDuration: [null, [Validators.required]],
      takeaway: [true, [Validators.required]],
      delivery: [true, [Validators.required]],
      freeDeliveryKilometer: [null, [Validators.required]],
      basicDeliveryCharge: [null, [Validators.required]],
      chargePerKilo: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.fetchOrderSetup()
  }

  fetchOrderSetup(): void {
    this.orderSetupService.getOrderSetup().subscribe(
      (response) => {
        console.log(response)
        this.orderForm.patchValue({
          foodPreparationTime: response.data.foodPreparationTime,
          orderSlotDuration: response.data.scheduleOrderSlotDuration,
          takeaway: response.data.isTakeawayEnabled,
          delivery: response.data.isDeliveryEnabled,
          freeDeliveryKilometer: response.data.freeDeliveryKilometer,
          basicDeliveryCharge: response.data.basicDeliveryCharge,
          chargePerKilo: response.data.chargePerKilo,
        });
      },
      (error) => {
        console.error('Error fetching order setup', error);
      }
    );
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      const orderSetup = {
        foodPreparationTime: this.orderForm.value.foodPreparationTime,
        scheduleOrderSlotDuration: this.orderForm.value.orderSlotDuration,
        isTakeawayEnabled: this.orderForm.value.takeaway,
        isDeliveryEnabled: this.orderForm.value.delivery,
        freeDeliveryKilometer: this.orderForm.value.freeDeliveryKilometer,
        basicDeliveryCharge: this.orderForm.value.basicDeliveryCharge,
        chargePerKilo: this.orderForm.value.chargePerKilo
      };

      this.orderSetupService.updateOrderSetup(orderSetup).subscribe(
        (response) => {
          console.log('Order setup updated successfully', response);
        },
        (error) => {
          console.error('Error updating order setup', error);
        }
      );
    } else {
      console.log('Form is invalid:', this.orderForm);
      this.orderForm.markAllAsTouched();
    }
  }
}
