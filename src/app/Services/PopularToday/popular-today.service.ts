import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PopularTodayService {
  private URL = environment.API_KEY;

  constructor(private http: HttpClient) { }

  // GET: Fetch all popular items by branchId
  getPopularItemById(id: number): Observable<any> {
    return this.http.get<any>(`${this.URL}/api/PopularItems/GetItemById?id=${id}`);
  }

  // DELETE: Delete a popular item by id
  deletePopularItem(id: number): Observable<any> {
    const url = `${this.URL}/api/PopularItems`;
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete<any>(url, { params });
  }

  // PUT: Update an existing popular item
  updatePopularItem(id: number, name: string, preprice: number, currentprice: number, description: string, imgFile: File, status: number): Observable<any> {
    const url = `${this.URL}/api/PopularItems/Update-PopularItem`;
    const formData = new FormData();
    formData.append('Id', id.toString());
    formData.append('Name', name);
    formData.append('preprice', preprice.toString());
    formData.append('currentprice', currentprice.toString());
    formData.append('Description', description);
    formData.append('ImgFile', imgFile);
    formData.append('Status', status.toString());

    return this.http.put<any>(url, formData);
  }

  // POST: Add a new popular item
  addPopularItem(id: number, name: string, preprice: number, currentprice: number, description: string, imgFile: File, status: number): Observable<any> {
    const url = `${this.URL}/api/PopularItems/AddPopularItem`;
    const formData = new FormData();
    formData.append('Id', id.toString());
    formData.append('Name', name);
    formData.append('preprice', preprice.toString());
    formData.append('currentprice', currentprice.toString());
    formData.append('Description', description);
    formData.append('ImgFile', imgFile);
    formData.append('Status', status.toString());

    return this.http.post<any>(url, formData);
  }

  // GET: Fetch all items by branchId (another similar endpoint)
  getAllItems(branchId: number): Observable<any> {
    const url = `${this.URL}/api/PopularItems/GetAllItems/${branchId}`;
    return this.http.get<any>(url);
  }

  filterPopularItems(
    name?: string,
    prePrice?: number,
    currentPrice?: number,
    description?: string,
    itemId?: number,
    branchId?: number,
    categoryName?: string,
    createdAtStart?: string,
    createdAtEnd?: string,
    isDeleted?: boolean,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<any> {
    const url = `${this.URL}/api/PopularItems/FilterPopularItems`;

    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (name) {
      params = params.set('name', name);
    }
    if (prePrice && prePrice !== undefined) {
      params = params.set('prePrice', prePrice.toString());
    }
    if (currentPrice && currentPrice !== undefined) {
      params = params.set('currentPrice', currentPrice.toString());
    }
    if (description) {
      params = params.set('description', description);
    }
    if (itemId !== undefined) {
      params = params.set('itemId', itemId.toString());
    }
    if (branchId && branchId !== undefined) {
      params = params.set('branchId', branchId.toString());
    }
    if (categoryName) {
      params = params.set('categoryName', categoryName);
    }
    if (createdAtStart) {
      params = params.set('createdAtStart', createdAtStart);
    }
    if (createdAtEnd) {
      params = params.set('createdAtEnd', createdAtEnd);
    }
    if (isDeleted && isDeleted !== undefined) {
      params = params.set('isDeleted', isDeleted.toString());
    }

    return this.http.get<any>(url, { params });
  }

  // PUT: Update a popular item image
  updatePopularItemImage(id: number, newImage: File): Observable<any> {
    const url = `${this.URL}/api/PopularItems/Update-PopularItem-Image`;
    const formData = new FormData();
    formData.append('Id', id.toString());
    formData.append('newImage', newImage);

    return this.http.put<any>(url, formData);
  }
}
