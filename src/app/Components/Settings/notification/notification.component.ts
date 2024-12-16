import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../Services/Notification/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  notificationForm: FormGroup;
  imageFile: File | null = null;
  imageFileError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.notificationForm = this.fb.group({
      vapidKey: ['', Validators.required],
      apiKey: ['', Validators.required],
      authDomain: ['', Validators.required],
      projectId: ['', Validators.required],
      storageBucket: ['', Validators.required],
      messagingSenderId: ['', Validators.required],
      appId: ['', Validators.required],
      measurementId: ['', Validators.required],
      image: ['']  // Optional, used to validate the image file
    });
  }

  // Method to handle file selection and validation
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (validTypes.includes(file.type)) {
        this.imageFile = file;
        this.imageFileError = null;
      } else {
        this.imageFileError = 'Invalid file type. Please select a JPEG, PNG, or GIF image.';
        this.imageFile = null;
      }
    }
  }

  // Method to submit the form and send the notification
  sendNotification() {
    console.log(this.notificationForm)
    if (this.notificationForm.valid) {
      const formData = new FormData();
      formData.append('FireBasePublicVapidKey', this.notificationForm.get('vapidKey')?.value);
      formData.append('FireBaseAPIKey', this.notificationForm.get('apiKey')?.value);
      formData.append('FireBaseProjectId', this.notificationForm.get('projectId')?.value);
      formData.append('FireBaseAuthDomain', this.notificationForm.get('authDomain')?.value);
      formData.append('FireBaseStorageBucket', this.notificationForm.get('storageBucket')?.value);
      formData.append('FireBaseMessageSenderId', this.notificationForm.get('messagingSenderId')?.value);
      formData.append('FireBaseAppId', this.notificationForm.get('appId')?.value);
      formData.append('FireBaseMeasurementId', this.notificationForm.get('measurementId')?.value);

      // Only append image file if one is selected and valid
      if (this.imageFile) {
        formData.append('ImageUrl', this.imageFile, this.imageFile.name);
      }

      // Call the notification service to send the notification
      this.notificationService.sendNotification(formData).subscribe(
        response => {
          console.log('Notification sent successfully:', response);
          this.notificationForm.reset();
        },
        error => {
          console.error('Error sending notification:', error);
        }
      );
    } else {
      this.notificationForm.markAllAsTouched();
      console.error('Form is invalid. Please check the inputs.');
    }
  }
}
