import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private URL = `${environment.API_KEY}`;

  constructor(private http: HttpClient) { }

  // Existing method to get permissions by roleId
  getPermissions(roleId: number): Observable<any> {
    return this.http.get<any>(`${this.URL}/api/Permissions/${roleId}`);
  }

  // New method to assign permissions to a role
  assignPermissions(roleId: number, permissions: any[]): Observable<any> {
    const body = {
      roleId: roleId,
      permissions: permissions
    };

    return this.http.post<any>(`${this.URL}/api/Permissions/Assign`, body);
  }
}
