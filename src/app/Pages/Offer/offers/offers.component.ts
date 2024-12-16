import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IItem } from '../../../Models/item';
import { IconComponent } from '../../../Components/Shared/icon/icon.component';
import { IOffer } from '../../../Models/ipromo';
import { OffersDialogComponent } from '../../../Components/Dialogs/offers-dialog/offers-dialog.component';
import { OfferDetailsComponent } from '../offer-details/offer-details.component';
import { OffersService } from '../../../Services/Offers/offers.service';
import { ConfirmDeleteDialogComponent } from "../../../Components/Dialogs/confirm-delete-dialog/confirm-delete-dialog.component";
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';
import { BreadcrumbComponent } from '../../../Components/Shared/breadcrumb/breadcrumb.component';
import { PaginationComponent } from '../../../Components/Shared/pagination/pagination.component';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule, IconComponent, ReactiveFormsModule, FormsModule, RouterModule, OfferDetailsComponent, OffersDialogComponent, ConfirmDeleteDialogComponent, BreadcrumbComponent, PaginationComponent],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.scss'
})
export class OffersComponent implements OnInit {
  isFilterVisible: boolean = false;
  isModalOpen: boolean = false;
  isMenuOpen: boolean = false;
  filteredItems: IItem[] = [];
  offers: IOffer[] = [];
  selectedOffer: IOffer | null = null;
  offersTypeLabel: string = '';
  currentPage: number = 1;
  totalPages: number = 4;

  isConfirmDeleteModalOpen: boolean = false;
  offerToDeleteId!: number;

  filters = {
    name: '',
    amount: '',
    startDate: '',
    endDate: '',
    status: '',
  };

  statuses = ['Active', 'Inactive'];

  constructor(
    private route: ActivatedRoute,
    private offersService: OffersService,
    private afterActionService: AfterActionService,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.loadOffers();

    this.route.url.subscribe((urlSegments) => {
      const path = urlSegments[0]?.path;

      switch (path) {
        case 'offers':
          this.offersTypeLabel = 'Offers';
          break;
      }
    });
  }

  loadOffers() {
    const { name, status, startDate, endDate } = this.filters;
    const statusInNum = status === 'Active' ? 1 : status === 'Inactive' ? 0 : undefined;

    this.offersService
      .getOffersWithFilter(name, statusInNum, startDate, endDate, this.currentPage)
      .subscribe((response) => {
        this.offers = response.data;
        this.totalPages = Math.ceil(response.totalItems / 10);
        console.log('Offers:', this.offers);
      });
  }

  applyFilters() {
    this.loadOffers();
  }

  toggleFilterVisibility() {
    this.isFilterVisible = !this.isFilterVisible;
  }

  openModal(action: string, user: IOffer | null) {
    this.selectedOffer = user;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  exportXLS() {
    console.log('Exporting as XLS...');
    this.isMenuOpen = false;
  }

  print() {
    console.log('Printing...');
    this.isMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isMenuOpen = false;
    }
  }

  clearFilters() {
    this.filters = {
      name: '',
      amount: '',
      startDate: '',
      endDate: '',
      status: '',
    };
    this.applyFilters();
  }

  openConfirmDeleteModal(id: number) {
    this.offerToDeleteId = id;
    this.isConfirmDeleteModalOpen = true;
  }

  deleteOffer(): void {
    if (this.offerToDeleteId) {
      this.offersService.deleteOffer(this.offerToDeleteId).subscribe(
        (response) => {
          console.log('Offer deleted successfully:', response);
          this.afterActionService.reloadCurrentRoute();
          this.isConfirmDeleteModalOpen = false;
        }, (error) => {
          console.error('Failed to delete offer:', error);
        }
      );
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadOffers();
  }
}
