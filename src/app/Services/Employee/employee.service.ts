import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private URL = environment.API_KEY;

  constructor(private http: HttpClient) { }

  // 1. Fetch all employees with query parameters
  getAllEmployees(
    userType?: number,
    name?: string,
    email?: string,
    phone?: string,
    roleId?: number,
    status?: number,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (userType !== undefined) params = params.set('userType', userType.toString());
    if (name) params = params.set('name', name);
    if (email) params = params.set('email', email);
    if (phone) params = params.set('phone', phone);
    if (roleId !== undefined) params = params.set('roleId', roleId.toString());
    if (status !== undefined) params = params.set('status', status.toString());

    return this.http.get(`${this.URL}/api/Employee/Get-All-Employees`, { params });
  }

  // 2. Update employee profile image
  updateProfileImage(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('ProfileImage', file, file.name);

    return this.http.put(`${this.URL}/api/Employee/${id}/update-profile-image`, formData);
  }

  // 3. Add address for an employee
  addEmployeeAddress(employeeId: number, addressData: {
    buildingName: string;
    street: string;
    apartmentNumber: string;
    addressLabel: string;
    addressType: number;
    floor: string;
  }): Observable<any> {
    return this.http.post(`${this.URL}/api/Employee/${employeeId}/addresses`, addressData, { responseType: 'text' });
  }

  // 4. Fetch an employee by ID
  getEmployeeById(id: number): Observable<any> {
    return this.http.get(`${this.URL}/api/Employee/${id}`);
  }

  // 5. Add a new employee
  addEmployee(employeeData: {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    userType: number;
    status: number;
    confirmPassword: string;
    roleId: number;
    branchIds: number[];
  }): Observable<any> {
    return this.http.post(`${this.URL}/api/Employee/Add-Employee`, employeeData);
  }

  // 6. Update an existing employee
  updateEmployee(employeeId: number, employeeData: {
    name: string;
    email: string;
    phoneNumber: string;
    status: number;
    password: string;
    confirmPassword: string;
    roleId: number;
    branchIds: number[];
  }): Observable<any> {
    return this.http.put(`${this.URL}/api/Employee/Update-Employee/${employeeId}`, employeeData);
  }

  // 7. Update employee address
  updateEmployeeAddress(
    employeeId: number,
    addressId: number,
    addressData: {
      buildingName: string;
      street: string;
      apartmentNumber: string;
      floor: string;
      addressLabel: string;
    }
  ): Observable<any> {
    return this.http.put(
      `${this.URL}/api/Employee/${employeeId}/addresses/${addressId}`,
      addressData
    );
  }

  // 8. Delete employee address
  deleteEmployeeAddress(employeeId: number, addressId: number): Observable<any> {
    return this.http.delete(`${this.URL}/api/Employee/${employeeId}/addresses/${addressId}`, { responseType: 'text' });
  }
}
