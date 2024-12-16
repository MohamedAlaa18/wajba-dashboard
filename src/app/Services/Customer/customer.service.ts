import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private URL = `${environment.API_KEY}/api/DashboardCustomer`;

  constructor(private http: HttpClient) { }

  // GET /api/DashboardCustomer/GetAllbyfileration
  getAllCustomers(name?: string, email?: string, phone?: string, status?: number, pageNumber?: number, pageSize?: number): Observable<any> {
    let params = new HttpParams();
    if (name) params = params.set('name', name);
    if (email) params = params.set('email', email);
    if (phone) params = params.set('phone', phone);
    if (status !== undefined) params = params.set('status', status.toString());
    if (pageNumber) params = params.set('pageNumber', pageNumber.toString());
    if (pageSize) params = params.set('pageSize', pageSize.toString());

    return this.http.get(`${this.URL}/GetAllbyfileration`, { params });
  }

  // PUT /api/DashboardCustomer/update-from-dashbord
  updateCustomer(id: string, customerData: any): Observable<any> {
    return this.http.put(`${this.URL}/update-from-dashbord?id=${id}`, customerData);
  }

  // POST /api/DashboardCustomer/add-from-dashbord
  addCustomer(customerData: any): Observable<any> {
    return this.http.post(`${this.URL}/add-from-dashbord`, customerData);
  }

  // GET /api/DashboardCustomer/getbyid
  getCustomerById(id: string): Observable<any> {
    let params = new HttpParams().set('id', id);
    return this.http.get(`${this.URL}/getbyid`, { params });
  }

  // DELETE /api/DashboardCustomer/deletebyid
  deleteCustomerById(id: string): Observable<any> {
    let params = new HttpParams().set('id', id);
    return this.http.delete(`${this.URL}/deletebyid`, { params });
  }

  // PUT /api/DashboardCustomer/{id}/update-profile-image
  updateProfileImage(id: string, imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('ProfileImage', imageFile);

    return this.http.put(`${this.URL}/${id}/update-profile-image`, formData);
  }

  // POST /api/DashboardCustomer/{customerId}/addresses
  addAddress(customerId: string, addressData: any): Observable<any> {
    return this.http.post(`${this.URL}/${customerId}/addresses`, addressData);
  }

  // GET /api/DashboardCustomer/{customerId}/addresses
  getAddresses(customerId: string): Observable<any> {
    return this.http.get(`${this.URL}/${customerId}/addresses`);
  }

  // PUT /api/DashboardCustomer/{customerId}/addresses/{addressId}
  updateAddress(customerId: string, addressId: number, addressData: any): Observable<any> {
    return this.http.put(`${this.URL}/${customerId}/addresses/${addressId}`, addressData);
  }

  // DELETE /api/DashboardCustomer/{customerId}/addresses/{addressId}
  deleteAddress(customerId: string, addressId: number): Observable<any> {
    return this.http.delete(`${this.URL}/${customerId}/addresses/${addressId}`);
  }
}
