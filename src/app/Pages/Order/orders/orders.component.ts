import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { IconComponent } from '../../../Components/Shared/icon/icon.component';
import { UserDialogComponent } from '../../../Components/Dialogs/user-dialog/user-dialog.component';
import { IOrder } from '../../../Models/iorder';
import { ITax } from '../../../Models/itax';
import { TaxService } from '../../../Services/Tax/tax.service';
import { OrderService } from '../../../Services/Order/order.service';
import { PaginationComponent } from '../../../Components/Shared/pagination/pagination.component';
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';
import { ConfirmDeleteDialogComponent } from '../../../Components/Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { BreadcrumbComponent } from '../../../Components/Shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, IconComponent, ReactiveFormsModule, FormsModule, UserDialogComponent, RouterModule, PaginationComponent, ConfirmDeleteDialogComponent, BreadcrumbComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  isFilterVisible: boolean = false;
  isModalOpen: boolean = false;
  isMenuOpen: boolean = false;
  filteredOrders: IOrder[] = [];
  orders: IOrder[] = [];
  taxes!: ITax[];
  selectedOrder: IOrder | null = null;
  OrderTypeLabel: string = '';

  isConfirmDeleteModalOpen: boolean = false;
  orderToDeleteId!: number;

  filters = {
    orderType: '',
    customerName: '',
    orderId: '',
    price: '',
    status: undefined,
    tax: '',
    from: '',
    to: '',
  };

  totalPages: number = 4;
  currentPage: number = 1;

  roles = ['POS Operation', 'Staff', 'Branch Manager'];
  statuses = [{ name: 'Active', id: 1 }, { name: 'Inactive', id: 0 }];
  orderTypes = ['Delivery', 'Drive tru', 'Pick up', 'Dine in'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taxService: TaxService,
    private orderService: OrderService,
    private afterActionService: AfterActionService,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.route.url.subscribe((urlSegments) => {
      const path = urlSegments[0]?.path;

      switch (path) {
        case 'posOrders':
          this.OrderTypeLabel = 'POS';
          this.applyFilters();
          break;
        default:
          this.orders = [];
          this.OrderTypeLabel = 'Uer';
      }
    });

    this.fetchTax();
  }

  fetchTax() {
    this.taxService.getAllTax().subscribe((data) => {
      this.taxes = data.data;
    });
  }

  applyFilters() {
    const storedBranch = JSON.parse(localStorage.getItem('selectedBranch') || '{}');
    const { orderType, customerName, orderId, price, status, tax, from, to } = this.filters;
    // console.log(this.filters)
    this.orderService.getAllPOSOrders(
      storedBranch.id,
      this.currentPage,
      10,  // Page size
      orderType || undefined,
      customerName || undefined,
      orderId ? +orderId : undefined,
      price ? +price : undefined,
      status || undefined,
      tax ? +tax : undefined,
      from || undefined,
      to || undefined
    ).subscribe((response) => {
      if (response.success) {
        this.orders = response.data;
        this.totalPages = Math.ceil(response.totalCount / 10);
        console.log(response);
      }
    }, (error) => {
      console.error('Error fetching orders with filters:', error);
    });
  }

  toggleFilterVisibility() {
    this.isFilterVisible = !this.isFilterVisible;
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

  openConfirmDeleteModal(id: number) {
    this.orderToDeleteId = id;
    this.isConfirmDeleteModalOpen = true;
  }

  deleteItem(): void {
    if (this.orderToDeleteId) {
      this.orderService.deleteOrder(this.orderToDeleteId).subscribe((response) => {
        console.log(`Item with id ${this.orderToDeleteId} deleted successfully.`, response);
        this.afterActionService.reloadCurrentRoute();
      }, (error) => {
        console.error(`Error deleting item with id ${this.orderToDeleteId}:`, error);
      });
    }
  }

  clearFilters() {
    this.filters = {
      orderType: '',
      customerName: '',
      orderId: '',
      price: '',
      status: undefined,
      tax: '',
      from: '',
      to: '',
    };
    this.currentPage = 1;
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.applyFilters();
  }
}
