import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private readonly URL = `${environment.API_KEY}/api/PushNotifications`;

  constructor(private http: HttpClient) { }

  // Fetch all push notifications with optional query parameters
  getAllPushNotifications(
    title?: string,
    date?: string,
    roleId?: number,
    userId?: number,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    if (title) params = params.set('title', title);
    if (date) params = params.set('date', date);
    if (roleId) params = params.set('roleId', roleId.toString());
    if (userId) params = params.set('userId', userId.toString());

    return this.http.get(`${this.URL}/Get-All-PushNotifications`, { params });
  }

  // Add a new push notification
  addPushNotification(
    title: string,
    description: string,
    imageUrl: File, // Accepts a file for image upload
    roleId: number,
    userId: number,
    date: string, // Add date parameter
  ): Observable<any> {
    const formData = new FormData();
    formData.append('Title', title);
    formData.append('Description', description);
    formData.append('ImageUrl', imageUrl);
    formData.append('RoleId', roleId.toString());
    formData.append('UserId', userId.toString());
    formData.append('Date', date); // Add Date field

    return this.http.post(`${this.URL}/Add`, formData);
  }

  // Fetch a specific push notification by ID
  getPushNotificationById(id: number): Observable<any> {
    return this.http.get(`${this.URL}/${id}`);
  }

  // Delete a specific push notification by ID
  deletePushNotification(id: number): Observable<any> {
    return this.http.delete(`${this.URL}/${id}`);
  }
}
