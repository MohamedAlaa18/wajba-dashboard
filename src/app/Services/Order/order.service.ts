import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private URL = environment.API_KEY;
  private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJpYnJhaGVtbWFsZWs4OTRAZ21haWwuY29tIiwianRpIjoiZDVhZWE5MTEtZGU5Ny00MDJjLWFkYzQtNGJjMWNlYTk3OWJmIiwibmFtZSI6IklicmFoZW0iLCJlbWFpbCI6ImlicmFoZW1tYWxlazg5NEBnbWFpbC5jb20iLCJJZCI6IjEiLCJwaG9uZSI6IjAxMDAzMzAzMTQxIiwiVXNlclR5cGUiOiJFbXBsb3llZSIsImV4cCI6MTc2MTUzMTMxMiwiaXNzIjoiaHR0cHM6Ly9mb29kb3JkZXIucnVuYXNwLm5ldC8iLCJhdWQiOiJodHRwczovL2Zvb2RvcmRlci5ydW5hc3AubmV0LyJ9.8UkjnsT1e-4c80Me2RLKrBbPmvmwHRS9xnoO_ZZhvg0';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
  }

  getOrderById(id: number): Observable<any> {
    return this.http.get<any>(`${this.URL}/api/PosOrder/PosOrder${id}`, { headers: this.getAuthHeaders() });
  }

  placeOrder(orderData: any): Observable<any> {
    return this.http.post<any>(`${this.URL}/api/PosOrder`, orderData, { headers: this.getAuthHeaders() });
  }

  getAllPOSOrders(
    branchId: number,
    pageNumber: number = 1,
    pageSize: number = 10,
    orderType?: string,
    customerName?: string,
    orderId?: number,
    price?: number,
    status?: string,
    tax?: number,
    startDate?: string,
    endDate?: string
  ): Observable<any> {
    let queryParams = `?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    if (orderType) queryParams += `&orderType=${orderType}`;
    if (customerName) queryParams += `&customerName=${customerName}`;
    if (orderId !== undefined) queryParams += `&orderId=${orderId}`;
    if (price !== undefined) queryParams += `&price=${price}`;
    if (status) queryParams += `&status=${status}`;
    if (tax !== undefined) queryParams += `&tax=${tax}`;
    if (startDate) queryParams += `&startDate=${startDate}`;
    if (endDate) queryParams += `&endDate=${endDate}`;

    return this.http.get<any>(`${this.URL}/api/PosOrder/All-POS-Orders/${branchId}${queryParams}`, {
      headers: this.getAuthHeaders()
    });
  }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.URL}/api/PosOrder/delete-order/${id}`);
  }
}
