import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IItem } from '../../../Models/item';
import { IconComponent } from '../../../Components/Shared/icon/icon.component';
import { IUser } from '../../../Models/user';
import { UserDialogComponent } from '../../../Components/Dialogs/user-dialog/user-dialog.component';
import { BreadcrumbComponent } from '../../../Components/Shared/breadcrumb/breadcrumb.component';
import { PaginationComponent } from '../../../Components/Shared/pagination/pagination.component';
import { EmployeeService } from '../../../Services/Employee/employee.service';
import { RoleService } from '../../../Services/Role/role.service';
import { IRole } from '../../../Models/iroles';
import { CustomerService } from '../../../Services/Customer/customer.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, IconComponent, ReactiveFormsModule, FormsModule, UserDialogComponent, RouterModule, PaginationComponent, BreadcrumbComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  isFilterVisible: boolean = false;
  isModalOpen: boolean = false;
  isMenuOpen: boolean = false;
  filteredItems: IItem[] = [];
  users: IUser[] = [];
  roles!: IRole[];
  selectedUser: IUser | null = null;
  userTypeLabel: string = '';
  userType: number = 0;
  totalPages: number = 4;
  currentPage: number = 1;

  filters = {
    name: '',
    email: '',
    phone: '',
    role: undefined,
    status: undefined,
  };

  statuses = [{ name: 'Active', id: 1 }, { name: 'Inactive', id: 0 }];

  administrators!: IUser[]
  deliveryBoys!: IUser[]
  customers!: IUser[]
  employees!: IUser[]

  breadcrumbs: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private employeeService: EmployeeService,
    private customerService: CustomerService,
    private roleService: RoleService,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    // Subscribe to route changes and adjust users based on the path
    this.activatedRoute.url.subscribe((urlSegments) => {
      const path = urlSegments[0]?.path;

      switch (path) {
        case 'administrators':
          this.users = this.administrators;
          this.userTypeLabel = 'Administrator';
          this.userType = 0;
          break;
        case 'deliveryBoys':
          this.users = this.deliveryBoys;
          this.userTypeLabel = 'Delivery Boy';
          this.userType = 2;
          break;
        case 'customers':
          this.users = this.customers;
          this.userTypeLabel = 'Customer';
          this.userType = 3;
          break;
        case 'employees':
          this.users = this.employees;
          this.userTypeLabel = 'Employee';
          this.userType = 1;
          break;
        default:
          this.users = [];
          this.userTypeLabel = 'User';
      }

      this.breadcrumbs = [
        { name: 'Dashboard', link: '/' },
        { name: this.userTypeLabel, link: '/items' },
      ];
    });

    if (this.userTypeLabel == 'Customer') {
      this.getAllCustomers();
    } else {
      this.getAllEmployees();
    }

    this.getAllRoles();
  }

  getAllRoles() {
    this.roleService.getAllRoles().subscribe((response: any) => {
      if (response) {
        this.roles = response.data;
        // console.log(response)
      } else {
        console.error('The response is not an array:', response);
        this.roles = [];
      }
    }, (error) => {
      console.error('Failed to load roles:', error);
    });
  }

  getAllEmployees(): void {
    this.employeeService.getAllEmployees(
      this.userType,
      this.filters.name,
      this.filters.email,
      this.filters.phone,
      this.filters.role,
      this.filters.status,
      this.currentPage,
      10 // Items per page
    ).subscribe(
      (response: any) => {
        this.users = response.data;
        this.totalPages = response.totalPages;
        console.log('Fetched users:', this.users);
      },
      error => {
        console.error('Error fetching employees:', error);
      }
    );
  }

  getAllCustomers(): void {
    this.customerService.getAllCustomers(
      this.filters.name,
      this.filters.email,
      this.filters.phone,
      this.filters.status,
      this.currentPage,
      10 // Items per page
    ).subscribe(
      (response: any) => {
        this.users = response.data;
        this.totalPages = response.totalPages;
        console.log('Fetched users:', this.users);
      },
      error => {
        console.error('Error fetching employees:', error);
      }
    );
  }


  applyFilters() {
    this.getAllEmployees();
    // Filter logic to be implemented
  }

  toggleFilterVisibility() {
    this.isFilterVisible = !this.isFilterVisible;
  }

  openModal(action: string, user: IUser | null) {
    this.selectedUser = user;
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
    this.isMenuOpen = false; // Close the menu after selection
  }

  print() {
    console.log('Printing...');
    this.isMenuOpen = false; // Close the menu after selection
  }

  clearFilters() {
    this.filters = {
      name: '',
      email: '',
      phone: '',
      role: undefined,
      status: undefined,
    };
    this.applyFilters(); // Clear filters and refresh the view
  }


  onPageChange(page: number): void {
    this.currentPage = page;
    // this.loadItems();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isMenuOpen = false;
    }
  }
}
