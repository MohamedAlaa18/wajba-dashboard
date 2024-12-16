import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IconComponent } from "../../Shared/icon/icon.component";
import { INotification } from '../../../Models/inotification';
import { PushNotificationService } from '../../../Services/PushNotification/push-notification.service';
import { RoleService } from '../../../Services/Role/role.service';
import { IRole, IUser } from '../../../Models/iroles';
import { AfterActionService } from '../../../Services/AfterAction/after-action.service';

@Component({
  selector: 'app-notification-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IconComponent],
  templateUrl: './notification-dialog.component.html',
  styleUrls: ['./notification-dialog.component.scss'],
  providers: [DatePipe],
})
export class NotificationDialogComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() notification: INotification | null = null;
  @Input() IsEmployee: boolean = false;
  @Output() close = new EventEmitter<void>();

  selectedFile: File | null = null;
  roles!: IRole[];
  users!: IUser[];
  notificationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private pushNotificationService: PushNotificationService,
    private roleService: RoleService,
    private afterActionService: AfterActionService,
    private datePipe: DatePipe
  ) {
    this.notificationForm = this.fb.group({
      role: ['', Validators.required],
      user: ['', Validators.required],
      name: ['', Validators.required],
      date: ['', Validators.required],
      imageUrl: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
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

  closeModal() {
    this.close.emit();
  }

  submitForm() {
    if (this.notificationForm.valid && this.selectedFile) {
      const { role, user, name, description, date } = this.notificationForm.value;
      const roleId = +role;
      const userId = +user;
      const formattedDate = this.datePipe.transform(date, 'MM-dd-yyyy') || '';

      this.pushNotificationService.addPushNotification(
        name, // Title
        description, // Description
        this.selectedFile, // Image file
        roleId, // Role ID
        userId, // User ID
        formattedDate
      ).subscribe(
        (response) => {
          console.log('Notification added successfully:', response);
          this.closeModal();
          this.afterActionService.reloadCurrentRoute();
        },
        (error) => {
          console.error('Error adding notification:', error);
        }
      );
    } else {
      console.warn('Form is invalid or file is not selected.');
      this.notificationForm.markAllAsTouched();
    }
  }

  // Handle file selection
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }
}
