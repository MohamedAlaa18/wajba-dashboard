import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private URL = `${environment.API_KEY}`;

  constructor(private http: HttpClient) { }

  // Method to send the form data to the /api/Themes endpoint
  submitTheme(logoFile: File, browserTabIcon: File, footerLogoFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('LogoUrl', logoFile);
    formData.append('BrowserTabIconUrl', browserTabIcon);
    formData.append('FooterLogoUrl', footerLogoFile);

    // Send the POST request with the multipart/form-data
    return this.http.post(`${this.URL}/api/Themes`, formData);
  }
}
