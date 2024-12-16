import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IconComponent } from '../../../Components/Shared/icon/icon.component';
import { IVoucher } from '../../../Models/ipromo';
import { OffersDialogComponent } from '../../../Components/Dialogs/offers-dialog/offers-dialog.component';
import { OfferDetailsComponent } from '../../Offer/offer-details/offer-details.component';
import { VouchersService } from '../../../Services/Vouchers/vouchers.service';
import { VouchersDialogComponent } from "../../../Components/Dialogs/vouchers-dialog/vouchers-dialog.component";
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';
import { ConfirmDeleteDialogComponent } from '../../../Components/Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { BreadcrumbComponent } from '../../../Components/Shared/breadcrumb/breadcrumb.component';
import { PaginationComponent } from '../../../Components/Shared/pagination/pagination.component';

@Component({
  selector: 'app-vouchers',
  standalone: true,
  imports: [CommonModule, IconComponent, ReactiveFormsModule, FormsModule, RouterModule, OfferDetailsComponent, OffersDialogComponent, VouchersDialogComponent, ConfirmDeleteDialogComponent, BreadcrumbComponent, PaginationComponent],
  templateUrl: './vouchers.component.html',
  styleUrl: './vouchers.component.scss'
})
export class VouchersComponent implements OnInit {
  isFilterVisible: boolean = false;
  isModalOpen: boolean = false;
  isMenuOpen: boolean = false;
  vouchers: IVoucher[] = [];
  selectedVoucher: IVoucher | null = null;
  vouchersTypeLabel: string = '';
  currentPage: number = 1;
  totalPages: number = 4;

  isConfirmDeleteModalOpen: boolean = false;
  voucherToDeleteId!: number;

  filters = {
    name: '',
    code: '',
    discount: '',
    discountType: '',
    startDate: '',
    endDate: '',
    minimumDiscount: '',
    maximumDiscount: '',
  };

  statuses = ['Active', 'Inactive'];
  discountTypes = [{ name: 'Fixed', id: 0 }, { name: 'Percentage', id: 1 }];

  constructor(
    private route: ActivatedRoute,
    private vouchersService: VouchersService,
    private afterActionService: AfterActionService,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.loadVouchers();

    this.route.url.subscribe((urlSegments) => {
      const path = urlSegments[0]?.path;

      switch (path) {
        case 'vouchers':
          this.vouchersTypeLabel = 'Voucher';
          break;
      }
    });
  }

  loadVouchers() {
    this.vouchersService.getCouponsWithFilteration(this.currentPage, 10, this.filters).subscribe(response => {
      this.vouchers = response.data;
      this.totalPages = Math.ceil(response.totalItems / 10);
      console.log(response)
    },
      error => {
        console.error(error)
      });
  }

  applyFilters() {
    this.loadVouchers();
  }

  toggleFilterVisibility() {
    this.isFilterVisible = !this.isFilterVisible;
  }

  openModal(action: string, voucher: IVoucher | null) {
    this.selectedVoucher = voucher;
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
      code: '',
      discount: '',
      discountType: '',
      startDate: '',
      endDate: '',
      minimumDiscount: '',
      maximumDiscount: '',
    };
    this.applyFilters();
  }

  openConfirmDeleteModal(id: number) {
    this.voucherToDeleteId = id;
    this.isConfirmDeleteModalOpen = true;
  }

  deleteVoucher(): void {
    if (this.voucherToDeleteId) {
      this.vouchersService.deleteCoupon(this.voucherToDeleteId).subscribe(
        (response) => {
          console.log('Voucher deleted successfully:', response);
          this.afterActionService.reloadCurrentRoute();
          this.isConfirmDeleteModalOpen = false;
        }, (error) => {
          console.error('Failed to delete voucher:', error);
        }
      );
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadVouchers();
  }
}
