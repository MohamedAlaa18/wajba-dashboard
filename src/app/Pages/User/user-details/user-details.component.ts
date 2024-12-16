import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AddressDialogComponent } from '../../../Components/Dialogs/address-dialog/address-dialog.component';
import { EmployeeService } from '../../../Services/Employee/employee.service';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { BreadcrumbComponent } from '../../../Components/Shared/breadcrumb/breadcrumb.component';
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';
import { Address, IUser } from '../../../Models/user';
import { ConfirmDeleteDialogComponent } from '../../../Components/Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { CustomerService } from '../../../Services/Customer/customer.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, AddressDialogComponent, BreadcrumbComponent, ConfirmDeleteDialogComponent],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  userId: any;
  user!: IUser;
  isModalOpen = false;
  selectedAddress: Address | null = null;
  breadcrumbs: any;
  selectedFileName: string | null = null;
  selectedFile: File | null = null;
  userTypeLabel: string = '';
  userTypeURL: string = '';
  previousUrl!: string;

  isConfirmDeleteModalOpen: boolean = false;
  addressToDeleteId!: number;

  constructor(
    private employeeService: EmployeeService,
    private customerService: CustomerService,
    private activatedRoute: ActivatedRoute,
    private afterActionService: AfterActionService,
    private router: Router
  ) {
    this.userId = this.activatedRoute.snapshot.paramMap.get('id') || '';

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationStart)
      )
      .subscribe((event: NavigationStart) => {
        if (this.router.url) {
          this.previousUrl = this.router.url;
          console.log(this.previousUrl)
        }
      });
  }

  ngOnInit(): void {
    if (isNaN(Number(this.userId))) {
      this.getCustomerDetails();
    } else {
      this.getEmployeeDetails();
    }
  }

  getCustomerDetails(): void {
    console.log(this.userId);
    this.customerService.getCustomerById(this.userId).subscribe(
      (response) => {
        this.user = response.data;
        this.userTypeLabel = 'Customer';
        this.userTypeURL = '/customers';
        console.log(response);
      },
      (error) => {
        console.error('Error fetching customer data:', error);
      }
    );
  }

  getEmployeeDetails(): void {
    this.employeeService.getEmployeeById(Number(this.userId)).subscribe(
      (response) => {
        this.user = response.data;
        this.updateBreadcrumb();
        console.log(response);
      },
      (error) => {
        console.error('Error fetching employee data:', error);
      }
    );
  }

  updateBreadcrumb() {
    switch (this.user.userType) {
      case 0:
        this.userTypeLabel = 'Administrator';
        this.userTypeURL = '/administrators'
        break;
      case 2:
        this.userTypeLabel = 'Delivery Boy';
        this.userTypeURL = '/deliveryBoys'
        break;
      case 3:
        this.userTypeLabel = 'Customer';
        this.userTypeURL = '/customers'
        break;
      case 1:
        this.userTypeLabel = 'Employee';
        this.userTypeURL = '/employees'
        break;
      default:
        this.userTypeLabel = 'User';
        this.userTypeURL = '/'
    }

    this.breadcrumbs = [
      { name: 'Dashboard', link: '/' },
      { name: `${this.userTypeLabel}`, link: `${this.userTypeURL}` },
      { name: 'View', link: '' },
    ];
  }

  openModal(action: string, address: Address | null) {
    this.selectedAddress = address;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openConfirmDeleteModal(id: number) {
    this.addressToDeleteId = id;
    this.isConfirmDeleteModalOpen = true;
  }

  deleteAddress() {
    if (this.addressToDeleteId) {
      this.employeeService.deleteEmployeeAddress(Number(this.userId), this.addressToDeleteId).subscribe(
        (response) => {
          console.log('Address deleted successfully:', response);
          this.afterActionService.reloadCurrentRoute();
        },
        (error) => {
          console.error('Error deleting address:', error);
        }
      );
    }
  }

  deleteCustomerAddress() {
    if (this.addressToDeleteId) {
      this.customerService.deleteAddress(this.userId, this.addressToDeleteId).subscribe(
        (response) => {
          console.log('Address deleted successfully:', response);
          this.afterActionService.reloadCurrentRoute();
        },
        (error) => {
          console.error('Error deleting address:', error);
        }
      );
    }
  }

  uploadNewImage() {
    if (this.selectedFile)
      this.employeeService.updateProfileImage(Number(this.userId), this.selectedFile).subscribe(
        (response) => {
          console.log('Image updated successfully:', response);
          this.afterActionService.reloadCurrentRoute();
        },
        (error) => {
          console.error('Error updating image:', error);
        }
      );
  }

  uploadCustomerNewImage() {
    if (this.selectedFile)
      this.customerService.updateProfileImage(this.userId, this.selectedFile).subscribe(
        (response) => {
          console.log('Image updated successfully:', response);
          this.afterActionService.reloadCurrentRoute();
        },
        (error) => {
          console.error('Error updating image:', error);
        }
      );
  }


  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFileName = input.files[0].name;
      this.selectedFile = input.files[0];

      if (isNaN(Number(this.userId))) {
        this.uploadCustomerNewImage();
      } else {
        this.uploadNewImage();
      }

    } else {
      this.selectedFileName = null;
      this.selectedFile = null;
    }
  }
}
