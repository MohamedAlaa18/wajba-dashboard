import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private URL = `${environment.API_KEY}`;

  constructor(private http: HttpClient) { }

  // Method to send a POST request with notification details
  sendNotification(notificationData: FormData): Observable<any> {
    const headers = new HttpHeaders().set('enctype', 'multipart/form-data');
    return this.http.post<any>(`${this.URL}/api/Notifications`, notificationData, { headers });
  }

  // Method to GET notification settings
  getNotificationSettings(): Observable<any> {
    return this.http.get<any>(`${this.URL}/api/NotificationSettings/get-settings`);
  }

  // Method to PUT updated notification settings
  updateNotificationSettings(settings: { id: number, isEnabled: boolean }[]): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.URL}/api/NotificationSettings/update-settings`, settings, {
      headers,
      responseType: 'text' as 'json' // This disables automatic JSON parsing
    });
  }
}
