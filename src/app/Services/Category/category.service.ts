import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  URL = environment.API_KEY;

  constructor(private httpClient: HttpClient) { }

  // Get all categories
  getAllCategories(): Observable<any> {
    return this.httpClient.get(`${this.URL}/api/Category/AllCategories`);
  }

  // Get category by ID
  getCategoryById(id: number): Observable<any> {
    return this.httpClient.get(`${this.URL}/api/Category/GetByid/${id}`); // Fixed URL by adding a slash
  }

  // Add a new category (POST /api/Category/Add)
  addCategory(name: string, image: File, status: number, description: string): Observable<any> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('Image', image);
    formData.append('status', status.toString());
    formData.append('Description', description);

    return this.httpClient.post(`${this.URL}/api/Category/Add`, formData);
  }

  // Update an existing category (PUT /api/Category/{id})
  updateCategory(id: number, name: string, image: File, status: number, description: string): Observable<any> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('Image', image);
    formData.append('status', status.toString());
    formData.append('Description', description);

    return this.httpClient.put(`${this.URL}/api/Category/${id}`, formData); // Use PUT request
  }

  // Delete category by ID (DELETE /api/Category/Delete)
  deleteCategory(id: number): Observable<any> {
    const params = new HttpParams().set('id', id.toString());
    return this.httpClient.delete(`${this.URL}/api/Category/${id}`, { params });
  }
}
