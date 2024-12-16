import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OTPService {
  private URL = environment.API_KEY;

  constructor(private http: HttpClient) { }

  sendOtp(data: { otpDto: { type: number; digitLimit: number; expiryTimeInMinutes: number } }): Observable<any> {
    return this.http.post<any>(`${this.URL}/api/OTP/add-otp`, data);
  }
}
