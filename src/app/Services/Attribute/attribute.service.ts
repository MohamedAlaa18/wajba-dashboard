import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

interface ItemAttribute {
  id?: number;
  name: string;
  status: number;
}

@Injectable({
  providedIn: 'root'
})
export class AttributeService {
  URL = environment.API_KEY;

  constructor(private http: HttpClient) { }

  // Fetch all item attributes (GET /api/ItemAttribute)
  getItemAttributes(): Observable<any> {
    return this.http.get<any>(`${this.URL}/api/ItemAttribute`);
  }

  // Fetch a specific item attribute by id (GET /api/ItemAttribute/{id})
  getItemAttributeById(id: number): Observable<ItemAttribute> {
    return this.http.get<ItemAttribute>(`${this.URL}/api/ItemAttribute/${id}`);
  }

  // Add a new item attribute (POST /api/ItemAttribute)
  addItemAttribute(attribute: ItemAttribute): Observable<any> {
    return this.http.post(`${this.URL}/api/ItemAttribute`, attribute);
  }

  // Update an item attribute by id (PUT /api/ItemAttribute/{id})
  updateItemAttribute(id: number, attribute: ItemAttribute): Observable<any> {
    // Include the id in the attribute object
    const attributeWithId = { ...attribute, id }; // Spread the existing attribute and add the id

    return this.http.put(`${this.URL}/api/ItemAttribute/${id}`, attributeWithId);
  }

  // Delete an item attribute by id (DELETE /api/ItemAttribute/{id})
  deleteItemAttribute(id: number): Observable<any> {
    return this.http.delete(`${this.URL}/api/ItemAttribute/${id}`);
  }
}
