import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  private URL = environment.API_KEY;

  constructor(private httpClient: HttpClient) { }

  // GET /api/Branch - Fetch all branches
  getAllBranches(): Observable<any> {
    return this.httpClient.get(`${this.URL}/api/Branch`);
  }

  // POST /api/Branch - Add a new branch
  addBranch(branchData: {
    name: string;
    longitude: number;
    latitude: number;
    email: string;
    phone: string;
    city: string;
    state: string;
    zipCode: string;
    address: string;
    status: number;
  }): Observable<any> {
    return this.httpClient.post(`${this.URL}/api/Branch`, branchData);
  }

  // GET /api/Branch/{id} - Fetch branch by ID
  getBranchById(id: string): Observable<any> {
    return this.httpClient.get(`${this.URL}/api/Branch/${id}`);
  }

  // PUT /api/Branch/{id} - Edit branch by ID
  editBranch(id: number, branchData: {
    name: string;
    longitude: number;
    latitude: number;
    email: string;
    phone: string;
    city: string;
    state: string;
    zipCode: string;
    address: string;
    status: number;
  }): Observable<any> {
    return this.httpClient.put(`${this.URL}/api/Branch/${id}`, branchData);
  }

  // DELETE /api/Branch/{id} - Delete branch by ID
  deleteBranch(id: number): Observable<any> {
    return this.httpClient.delete(`${this.URL}/api/Branch/${id}`);
  }

  getBranchByRestaurantId(restaurantId: number): Observable<any> {
    return this.httpClient.get<any>(`${this.URL}/api/Branch/Company/${restaurantId}`);
  }
}
