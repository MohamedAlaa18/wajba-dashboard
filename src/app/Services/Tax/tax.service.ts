import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TaxService {
  URL = environment.API_KEY;

  constructor(private httpClient: HttpClient) { }

  // Get all tax categories
  getAllTax(): Observable<any> {
    return this.httpClient.get(`${this.URL}/api/Tax`);
  }

  // Get tax by ID
  getTaxById(id: number): Observable<any> {
    return this.httpClient.get(`${this.URL}/api/Tax/${id}`);
  }

  // Add new tax
  addTax(taxData: { name: string, code: number, taxRate: number, status: number }): Observable<any> {
    return this.httpClient.post(`${this.URL}/api/Tax`, taxData);
  }

  // Edit tax by ID
  editTax(id: number, taxData: { name: string, code: number, taxRate: number, status: number }): Observable<any> {
    return this.httpClient.put(`${this.URL}/api/Tax/${id}`, taxData);
  }

  // Delete tax by ID
  deleteTax(id: number): Observable<any> {
    return this.httpClient.delete(`${this.URL}/api/Tax/${id}`);
  }
}
