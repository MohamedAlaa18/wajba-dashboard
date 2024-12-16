import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AddonsService {

  private URL = environment.API_KEY;

  constructor(private http: HttpClient) { }

  // GET request to fetch addons by item ID
  getItemAddons(itemId: number): Observable<any> {
    const params = new HttpParams().set('itemId', itemId.toString());
    return this.http.get(`${this.URL}/api/ItemAddons/itemaddons`, { params });
  }

  // POST request to create a new item addon (multipart/form-data)
  createItemAddon(name: string, price: number, itemId: number): Observable<any> {
    const formData = new FormData();
    console.log("name", name);

    formData.append('Name', name);
    formData.append('Price', price.toString());
    formData.append('ItemId', itemId.toString());

    return this.http.post(`${this.URL}/api/ItemAddons`, formData, {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    });
  }

  // PUT request to update an existing item addon
  updateItemAddon(itemAddonId: number, name: string, price: number, itemId: number): Observable<any> {
    const body = {
      itemAddonId: itemAddonId,
      name: name,
      price: price,
      itemId: itemId
    };

    return this.http.put(`${this.URL}/api/ItemAddons/update`, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  // DELETE request to delete an item addon by addonId and itemId
  deleteItemAddon(itemAddonId: number, itemId: number): Observable<any> {
    const body = { itemAddonId, itemId };
    return this.http.request('delete', `${this.URL}/api/ItemAddons/deleteItemAddon`, {
      body: body,
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // GET /api/ItemAddons/ItemForaddondropdowns - Fetches all items for addon dropdowns
  getItemForAddonDropdowns(): Observable<any> {
    return this.http.get(`${this.URL}/api/ItemAddons/ItemForaddondropdowns`, {
      headers: new HttpHeaders({ 'Accept': 'application/json' })
    });
  }

  // GET /api/ItemAddons/Variationsaddondropdowns - Fetches variations for addon dropdowns by item ID
  getVariationsAddonDropdowns(itemId: number): Observable<any> {
    const params = new HttpParams().set('itemId', itemId.toString());
    return this.http.get(`${this.URL}/api/ItemAddons/Variationsaddondropdowns`, { params });
  }
}
