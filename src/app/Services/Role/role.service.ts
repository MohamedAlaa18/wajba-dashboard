import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private URL = `${environment.API_KEY}`;

  constructor(private http: HttpClient) { }

  // POST: Create a new role
  createRole(name: string): Observable<any> {
    const url = `${this.URL}/api/Role/create`;
    const body = { name };
    return this.http.post(url, body);
  }

  // PUT: Update an existing role by ID
  updateRole(id: number, name: string): Observable<any> {
    const url = `${this.URL}/api/Role/${id}`;
    const body = { name };
    return this.http.put(url, body);
  }

  // GET: Fetch all roles
  getAllRoles(): Observable<any> {
    const url = `${this.URL}/api/Role/all`;
    return this.http.get(url);
  }

  // DELETE: Delete a role by ID
  deleteRole(id: number): Observable<any> {
    const url = `${this.URL}/api/Role/${id}`;
    return this.http.delete(url);
  }

  // GET: Fetch users by role ID
  getUsersByRole(roleId: number): Observable<any> {
    const url = `${this.URL}/api/Role/users/${roleId}`;
    return this.http.get(url);
  }
}
