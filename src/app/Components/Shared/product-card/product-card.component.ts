import { Component, Input } from '@angular/core';
import { IProductItem } from '../../../Models/product-item';
import { AddToCartModalComponent } from "../add-to-cart-modal/add-to-cart-modal.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [AddToCartModalComponent, CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  modalData = {
    header: 'Salmon With Mix Vegetables',
    body: ' LMIV - Allergen - i). Contains fish and products thereof. ii). Contains sulphur dioxide and sulphites. iii). Contains soybeans and products thereof. iv). Contains milk and products thereof (including lactose). v).'
  }

  @Input() productItem!: IProductItem;

  isInfoModalOpen = false;
  isAddModalOpen = false;

  openInfoModal() {
    this.isInfoModalOpen = true;
  }

  closeInfoModal() {
    this.isInfoModalOpen = false;
  }

  openAddModal() {
    this.isAddModalOpen = true;
  }

  closeAddModal() {
    this.isAddModalOpen = false;
  }
}
