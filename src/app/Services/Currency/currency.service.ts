import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private URL = `${environment.API_KEY}`;

  constructor(private http: HttpClient) { }

  // POST: Create a new currency
  createCurrency(currencyData: any): Observable<any> {
    return this.http.post(`${this.URL}/api/Currency`, currencyData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // GET: Fetch all currencies
  getAllCurrencies(): Observable<any> {
    return this.http.get(`${this.URL}/api/Currency`);
  }

  // GET: Fetch a specific currency by ID
  getCurrencyById(id: number): Observable<any> {
    return this.http.get(`${this.URL}/api/Currency/${id}`);
  }

  // PUT: Update a currency by ID
  updateCurrency(id: number, currencyData: any): Observable<any> {
    return this.http.put(`${this.URL}/api/Currency/${id}`, currencyData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // DELETE: Delete a currency by ID
  deleteCurrency(id: number): Observable<any> {
    return this.http.delete(`${this.URL}/api/Currency/${id}`);
  }
}
