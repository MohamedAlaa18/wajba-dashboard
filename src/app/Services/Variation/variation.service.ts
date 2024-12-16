import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class VariationService {

  private URL = `${environment.API_KEY}/api/ItemVariation`;

  constructor(private http: HttpClient) { }

  // GET request to fetch all item variations for a specific item
  getAllVariationsForItem(itemId: number): Observable<any> {
    return this.http.get(`${this.URL}/GetAllItemVariationsForSpecificItem`, {
      params: { id: itemId.toString() }
    });
  }

  // POST request to create a new item variation
  createVariation(variation: any): Observable<any> {
    return this.http.post(`${this.URL}`, variation, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  // PUT request to update an existing item variation
  updateVariation(variation: any): Observable<any> {
    return this.http.put(`${this.URL}`, variation, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  deleteVariation(variationId: number, itemId: number): Observable<any> {
    const requestBody = { variationId, itemId };
    return this.http.delete(`${this.URL}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: requestBody
    });
  }
}
