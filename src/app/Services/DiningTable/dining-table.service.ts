import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DiningTableService {
  private URL = environment.API_KEY;

  constructor(private http: HttpClient) { }

  // Fetch filtered dining tables
  filterDiningTables(
    name?: string,
    size?: number,
    status?: boolean,
    branchId?: number,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (name) {
      params = params.set('name', name);
    }
    if (size) {
      params = params.set('size', size.toString());
    }
    if (status !== undefined) {
      params = params.set('status', status.toString());
    }
    if (branchId) {
      params = params.set('branchId', branchId.toString());
    }

    return this.http.get(`${this.URL}/api/DiningTable/FilterDiningTables`, { params });
  }

  // Get dining table by ID
  getDiningTableById(id: number): Observable<any> {
    return this.http.get(`${this.URL}/api/DiningTable/GetbyDinetableId`, {
      params: new HttpParams().set('id', id.toString())
    });
  }

  // Create a new dining table
  createDiningTable(diningTable: { name: string, size: number, isActive: boolean, branchId: number }): Observable<any> {
    return this.http.post(`${this.URL}/api/DiningTable`, diningTable);
  }

  // Update an existing dining table
  updateDiningTable(id: number, diningTable: { name: string, size: number, isActive: boolean, branchId: number }): Observable<any> {
    return this.http.put(`${this.URL}/api/DiningTable`, diningTable, {
      params: new HttpParams().set('id', id.toString())
    });
  }

  // Delete a dining table
  deleteDiningTable(id: number): Observable<any> {
    return this.http.delete(`${this.URL}/api/DiningTable`, {
      params: new HttpParams().set('id', id.toString())
    });
  }
}
