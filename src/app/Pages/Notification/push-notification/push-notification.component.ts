import { CommonModule, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { IconComponent } from '../../../Components/Shared/icon/icon.component';
import { UserDialogComponent } from '../../../Components/Dialogs/user-dialog/user-dialog.component';
import { INotification } from '../../../Models/inotification';
import { NotificationDialogComponent } from "../../../Components/Dialogs/notification-dialog/notification-dialog.component";
import { PushNotificationService } from '../../../Services/PushNotification/push-notification.service';
import { BreadcrumbComponent } from '../../../Components/Shared/breadcrumb/breadcrumb.component';
import { IRole, IUser } from '../../../Models/iroles';
import { RoleService } from '../../../Services/Role/role.service';
import { PaginationComponent } from '../../../Components/Shared/pagination/pagination.component';
import { ConfirmDeleteDialogComponent } from '../../../Components/Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';

@Component({
  selector: 'app-push-notification',
  standalone: true,
  imports: [CommonModule, IconComponent, ReactiveFormsModule, FormsModule, UserDialogComponent, RouterModule, NotificationDialogComponent, BreadcrumbComponent, PaginationComponent, ConfirmDeleteDialogComponent],
  templateUrl: './push-notification.component.html',
  styleUrls: ['./push-notification.component.scss']
})
export class PushNotificationComponent implements OnInit {
  isFilterVisible: boolean = false;
  isModalOpen: boolean = false;
  isMenuOpen: boolean = false;
  notifications: INotification[] = [];
  selectedNotification: INotification | null = null;
  notificationTypeLabel: string = '';
  roles!: IRole[];
  users!: IUser[];

  totalPages: number = 4;
  currentPage: number = 1;

  isConfirmDeleteModalOpen: boolean = false;
  notificationToDeleteId!: number;

  filters = {
    title: '',
    role: '',
    user: '',
    date: '',
  };

  statuses = ['Active', 'Inactive'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pushNotificationService: PushNotificationService,
    private roleService: RoleService,
    private afterActionService: AfterActionService
  ) { }

  ngOnInit(): void {
    this.loadNotifications();
    this.getAllRoles();

    // Subscribe to route changes and adjust users based on the path
    this.route.url.subscribe((urlSegments) => {
      const path = urlSegments[0]?.path;

      switch (path) {
        case 'notifications':
          this.notificationTypeLabel = 'Push Notification';
          break;
      }
    });
  }

  loadNotifications(): void {
    const { title, role, user, date } = this.filters;

    // Parse the date if available
    const formattedDate = date ? formatDate(date, 'yyyy-MM-dd', 'en-US') : undefined;

    // Call the service method with filter values
    this.pushNotificationService.getAllPushNotifications(
      title,
      formattedDate,
      role ? +role : undefined,
      user ? +user : undefined,
      this.currentPage,
      10
    ).subscribe(
      (response) => {
        this.notifications = response.data;
        this.totalPages = Math.ceil(response.totalItems / 10);
        console.log(response);
      },
      (error) => {
        console.error('Error fetching notifications:', error);
      }
    );
  }

  openConfirmDeleteModal(id: number) {
    this.notificationToDeleteId = id;
    this.isConfirmDeleteModalOpen = true;
  }

  deleteNotification(): void {
    if (this.notificationToDeleteId) {
      this.pushNotificationService.deletePushNotification(this.notificationToDeleteId).subscribe(
        (response) => {
          console.log(`Notification with ID ${this.notificationToDeleteId} deleted successfully.`, response);
          this.afterActionService.reloadCurrentRoute();
        },
        (error) => {
          console.error('Error deleting notification:', error);
        }
      );
    }
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

  applyFilters() {
    this.loadNotifications();
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

  clearFilters() {
    this.filters = {
      title: '',
      role: '',
      user: '',
      date: '',
    };
    this.applyFilters();
  }

  openModal(action: string, notification: INotification | null) {
    this.selectedNotification = notification;
    this.isModalOpen = true;
  }

  onRoleSelected(event: Event): void {
    const roleId = parseInt((event.target as HTMLSelectElement).value, 10);
    this.roleService.getUsersByRole(roleId).subscribe(
      (response) => {
        this.users = response.data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadNotifications();
  }
}
