import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SalesReportService {

  private URL = `${environment.API_KEY}/api/Order/SalesReport`;

  constructor(private http: HttpClient) { }

  getSalesReport(params: {
    branchId?: number,
    startDate?: string,
    endDate?: string,
    dateorder?: string,
    status?: string,
    ordertyp?: number,
    orderId?: number,
    fromprice?: number,
    toprice?: number,
    pageNumber?: number,
    pageSize?: number
  }): Observable<any> {

    let httpParams = new HttpParams();
    if (params.branchId) httpParams = httpParams.set('branchId', params.branchId.toString());
    if (params.startDate) httpParams = httpParams.set('startDate', params.startDate);
    if (params.endDate) httpParams = httpParams.set('endDate', params.endDate);
    if (params.dateorder) httpParams = httpParams.set('dateorder', params.dateorder);
    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.ordertyp) httpParams = httpParams.set('ordertyp', params.ordertyp.toString());
    if (params.orderId) httpParams = httpParams.set('orderId', params.orderId.toString());
    if (params.fromprice) httpParams = httpParams.set('fromprice', params.fromprice.toString());
    if (params.toprice) httpParams = httpParams.set('toprice', params.toprice.toString());
    if (params.pageNumber) httpParams = httpParams.set('pageNumber', params.pageNumber.toString());
    if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());

    return this.http.get(this.URL, { params: httpParams });
  }
}
