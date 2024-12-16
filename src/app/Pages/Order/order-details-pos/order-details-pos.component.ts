import { Component, OnInit } from '@angular/core';
import { IconComponent } from '../../../Components/Shared/icon/icon.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IOrder } from '../../../Models/iorder';
import { OrderService } from '../../../Services/Order/order.service';
import { BreadcrumbComponent } from '../../../Components/Shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-order-details-pos',
  standalone: true,
  imports: [IconComponent, CommonModule, BreadcrumbComponent],
  templateUrl: './order-details-pos.component.html',
  styleUrl: './order-details-pos.component.scss',
})
export class OrderDetailsPosComponent implements OnInit {
  isPaidMenuOpen: boolean = false;
  isAcceptMenuOpen: boolean = false;
  orderId: number;
  order!: IOrder;

  constructor(
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute
  ) {
    this.orderId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.fetchOrder();
  }

  fetchOrder() {
    this.orderService.getOrderById(this.orderId).subscribe(
      (response) => {
        this.order = response.data;
        console.log(response);
      },
      (error) => {
        console.error('Error fetching order:', error);
      }
    );
  }

  togglePaidMenu() {
    this.isPaidMenuOpen = !this.isPaidMenuOpen;
    if (this.isPaidMenuOpen) {
      this.isAcceptMenuOpen = false;
    }
  }

  toggleAcceptMenu() {
    this.isAcceptMenuOpen = !this.isAcceptMenuOpen;
    if (this.isAcceptMenuOpen) {
      this.isPaidMenuOpen = false;
    }
  }
}
