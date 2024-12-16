import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ExtraService {

  private URL = `${environment.API_KEY}/api/ItemExtra`;

  constructor(private http: HttpClient) { }

  // POST request to create a new item extra
  createExtra(extra: any): Observable<any> {
    return this.http.post(`${this.URL}`, extra, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  // GET request to fetch item extra by ID
  getExtraById(id: number): Observable<any> {
    return this.http.get(`${this.URL}?id=${id}`);
  }

  // PUT request to update an item extra
  updateExtra(extra: any): Observable<any> {
    return this.http.put(this.URL, extra, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // DELETE request to delete an item extra
  deleteExtra(extraId: number, itemId: number): Observable<any> {
    const body = { extraId, itemId };
    return this.http.request('delete', this.URL, {
      body: body,
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
}
