import { Component } from '@angular/core';
import { IconComponent } from '../../../Components/Shared/icon/icon.component';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../Components/Shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [IconComponent, CommonModule,BreadcrumbComponent],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent {
  isModalOpen: boolean = false;
  currentModal: 'accept' | 'reject' | null = null;

  openModal(modalType: 'accept' | 'reject'): void {
    this.currentModal = modalType;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.currentModal = null;
  }

  performReject(): void {
    console.log('Order Rejected');
    this.closeModal();
  }

  performAccept(): void {
    console.log('Order Accepted');
    this.closeModal();
  }
}
