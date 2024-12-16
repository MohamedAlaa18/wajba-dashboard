import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IOffer } from '../../../Models/ipromo';
import { FormsModule } from '@angular/forms';
import { DetailsTableComponent } from '../../Item/ItemDetails/details-table/details-table.component';
import { OffersService } from '../../../Services/Offers/offers.service';
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';
import { ConfirmDeleteDialogComponent } from '../../../Components/Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { BreadcrumbComponent } from '../../../Components/Shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-offer-details',
  standalone: true,
  imports: [CommonModule, DetailsTableComponent, FormsModule, ConfirmDeleteDialogComponent,BreadcrumbComponent],
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.scss']
})
export class OfferDetailsComponent implements OnInit {
  activeSection: string = 'information';
  showItemModal = false;
  offerId!: number;
  offer!: IOffer;
  selectedItem: any = null;
  selectedFileName: string | null = null;
  selectedFile: File | null = null;

  isConfirmDeleteCategoryModalOpen: boolean = false;
  categoryToDeleteId!: number;
  isConfirmDeleteItemModalOpen: boolean = false;
  itemToDeleteId!: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private offersService: OffersService,
    private afterActionService: AfterActionService,
  ) {
    this.offerId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.getOfferDetails();
  }

  // Method to get offer details
  getOfferDetails() {
    if (this.offerId) {
      this.offersService.getOfferById(this.offerId).subscribe(
        (response) => {
          this.offer = response.data;
          console.log('Offer details:', response);
        },
        (error) => {
          console.error('Error fetching offer details:', error);
        }
      );
    }
  }

  openItemModal() {
    this.showItemModal = true;
  }

  closeItemModal() {
    this.showItemModal = false;
  }

  saveItem() {
    console.log('Selected Item:', this.selectedItem);
    this.closeItemModal();
  }

  deleteItem(itemId: number) { }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFileName = input.files[0].name;
      this.selectedFile = input.files[0];
      this.updateItemImage();
    } else {
      this.selectedFileName = null;
      this.selectedFile = null;
    }
  }

  updateItemImage(): void {
    if (this.selectedFile) {
      this.offersService.updateImage(this.offerId, this.selectedFile).subscribe(
        (response) => {
          console.log('Image updated successfully:', response);
          this.afterActionService.reloadCurrentRoute();
        },
        (error) => {
          console.error('Error updating image:', error);
        }
      );
    }
  }

  openConfirmDeleteItemModal(id: number) {
    this.itemToDeleteId = id;
    this.isConfirmDeleteItemModalOpen = true;
  }

  openConfirmDeleteCategoryModal(id: number) {
    this.categoryToDeleteId = id;
    this.isConfirmDeleteCategoryModalOpen = true;
  }


  removeItems(): void {
    if (this.itemToDeleteId) {
      this.offersService.removeItemsFromOffer(this.itemToDeleteId).subscribe({
        next: (response) => {
          console.log(`Items removed from offer ${this.itemToDeleteId}`, response);
          this.afterActionService.reloadCurrentRoute();
        },
        error: (err) => console.error('Error removing items:', err)
      });
    }
  }

  removeCategories(): void {
    if (this.categoryToDeleteId) {
      this.offersService.removeCategoriesFromOffer(this.categoryToDeleteId).subscribe({
        next: (response) => {
          console.log(`Categories removed from offer ${this.categoryToDeleteId}`, response);
          this.afterActionService.reloadCurrentRoute();
        },
        error: (err) => console.error('Error removing categories:', err)
      });
    }
  }
}
