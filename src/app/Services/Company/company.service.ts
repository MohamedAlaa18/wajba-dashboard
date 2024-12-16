import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private URL = environment.API_KEY;

  constructor(private http: HttpClient) { }

  // Method to send company data
  addCompany(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.URL}/api/Company`, formData);
  }

  // Method to get all companies
  getAllCompanies(): Observable<any> {
    return this.http.get<any>(`${this.URL}/api/Company`);
  }

  // Method to get a specific company by ID
  getCompanyById(id: number): Observable<any> {
    return this.http.get<any>(`${this.URL}/api/Company/${id}`);
  }

  // Method to update a specific company by ID
  updateCompany(id: number, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.URL}/api/Company/${id}`, formData);
  }
}
