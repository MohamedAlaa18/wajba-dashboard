import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private URL = `${environment.API_KEY}/api/SendingEmail`;

  constructor(private http: HttpClient) { }

  // Fetch all email configurations
  getEmailConfig(): Observable<any> {
    return this.http.get<any>(`${this.URL}/Getall`);
  }

  // Update email configuration
  updateEmailConfig(emailConfig: any): Observable<any> {
    return this.http.put(`${this.URL}`, emailConfig, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
}
