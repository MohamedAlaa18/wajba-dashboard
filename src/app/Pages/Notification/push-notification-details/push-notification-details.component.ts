import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PushNotificationService } from '../../../Services/PushNotification/push-notification.service';
import { INotification } from '../../../Models/inotification';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../Components/Shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-push-notification-details',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  templateUrl: './push-notification-details.component.html',
  styleUrl: './push-notification-details.component.scss'
})
export class PushNotificationDetailsComponent implements OnInit {
  notificationId!: number;
  notification!: INotification;

  constructor(
    private activatedRoute: ActivatedRoute,
    private pushNotificationService: PushNotificationService,
  ) {
    this.notificationId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.getItemById();
  }

  getItemById() {
    this.pushNotificationService.getPushNotificationById(this.notificationId).subscribe(
      (response) => {
        this.notification = response;
        console.log(response);
      },
      (error) => {
        console.error('Error fetching notification:', error);
      }
    );
  }

}
