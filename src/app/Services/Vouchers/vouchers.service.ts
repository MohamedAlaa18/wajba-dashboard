import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VouchersService {
  private URL = environment.API_KEY;

  constructor(private http: HttpClient) { }

  // POST: Create a new coupon
  createCoupon(couponData: FormData): Observable<any> {
    return this.http.post(`${this.URL}/api/Coupons`, couponData, {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    });
  }

  // PUT: Update an existing coupon
  updateCoupon(id: number, couponData: FormData): Observable<any> {
    const url = `${this.URL}/api/Coupons/${id}`;
    return this.http.put(url, couponData, {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    });
  }

  // DELETE: Delete a coupon
  deleteCoupon(id: number): Observable<any> {
    const url = `${this.URL}/api/Coupons/${id}`;
    return this.http.delete(url);
  }

  // GET: Get a specific coupon by ID
  getCouponById(id: number): Observable<any> {
    const url = `${this.URL}/api/Coupons/${id}`;
    return this.http.get(url);
  }

  getCouponsWithFilteration(pageNumber: number, pageSize: number, filters: any): Observable<any> {
    const params: any = {
      pageNumber: pageNumber,
      pageSize: pageSize,
      ...filters,
    };

    return this.http.get(`${this.URL}/api/Coupons/GetCouponsWithFilteration`, { params });
  }
}
