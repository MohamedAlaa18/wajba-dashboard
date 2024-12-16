import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  private URL = environment.API_KEY;

  constructor(private http: HttpClient) { }

  // DELETE: Delete Item by ID
  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.URL}/api/Item/Delete/${id}`);
  }

  // GET: Get All Items by branch
  getAllItems(branchId: number): Observable<any> {
    return this.http.get(`${this.URL}/api/Item/GetAll/${branchId}`);
  }

  // GET: Get Item by ID
  getItemById(id: number): Observable<any> {
    return this.http.get(`${this.URL}/api/Item/GetById/${id}`);
  }

  // editItem method
  editItem(itemData: {
    Id: number,
    Name: string,
    ImageUrl: File,
    Price: number,
    IsFeatured: boolean,
    status: number,
    ItemType: number,
    Note?: string,
    Description?: string,
    TaxValue: number,
    CategoryId: number
  }): Observable<any> {
    const formData = new FormData();
    formData.append('Id', itemData.Id.toString());
    formData.append('Name', itemData.Name);
    formData.append('ImageUrl', itemData.ImageUrl);
    formData.append('Price', itemData.Price.toString());
    formData.append('IsFeatured', String(itemData.IsFeatured));
    formData.append('status', itemData.status.toString());
    formData.append('ItemType', itemData.ItemType.toString());
    if (itemData.Note) {
      formData.append('Note', itemData.Note);
    }
    if (itemData.Description) {
      formData.append('Description', itemData.Description);
    }
    formData.append('TaxValue', itemData.TaxValue.toString());
    formData.append('CategoryId', itemData.CategoryId.toString());

    return this.http.put(`${this.URL}/api/Item/Edit`, formData);
  }

  // addItem method
  addItem(itemData: {
    Name: string,
    ImageUrl: File,
    Price: number,
    IsFeatured: boolean,
    status: number,
    ItemType: number,
    Note?: string,
    Description?: string,
    TaxValue: number,
    CategoryId: number,
    BranchIds: number[] // Changed to array
  }): Observable<any> {
    const formData = new FormData();
    formData.append('Name', itemData.Name);
    formData.append('ImageUrl', itemData.ImageUrl);
    formData.append('Price', itemData.Price.toString());
    formData.append('IsFeatured', String(itemData.IsFeatured));
    formData.append('status', itemData.status.toString());
    formData.append('ItemType', itemData.ItemType.toString());
    if (itemData.Note) {
      formData.append('Note', itemData.Note);
    }
    if (itemData.Description) {
      formData.append('Description', itemData.Description);
    }
    formData.append('TaxValue', itemData.TaxValue.toString());
    formData.append('CategoryId', itemData.CategoryId.toString());

    // Add each BranchId to the FormData
    itemData.BranchIds.forEach((branchId, index) => {
      formData.append(`BranchIds[${index}]`, branchId.toString());
    });

    return this.http.post(`${this.URL}/api/Item/Add`, formData);
  }

  updateItemImage(id: number, newImage: File): Observable<any> {
    const formData = new FormData();
    formData.append('Id', id.toString());
    formData.append('newImage', newImage);

    return this.http.put(`${this.URL}/api/Item/Update-Item-Image`, formData);
  }

  getAllItemsWithPagination(
    branchId: number,
    pageNumber: number = 1,
    pageSize: number = 10,
    name?: string,
    price?: number,
    categoryId?: number,
    isActive?: boolean,
    isFeatured?: boolean
  ): Observable<any> {
    let queryParams = `?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    if (name) queryParams += `&name=${name}`;
    if (price) queryParams += `&price=${price}`;
    if (categoryId) queryParams += `&categoryId=${categoryId}`;
    if (isActive !== undefined) queryParams += `&isActive=${isActive}`;
    if (isFeatured !== undefined) queryParams += `&isFeatured=${isFeatured}`;

    return this.http.get(`${this.URL}/api/Item/GetAllItemsWithPagination/${branchId}${queryParams}`);
  }

  getItems(categoryId?: number, branchId?: number, name?: string): Observable<any> {
    let params = new HttpParams();
    if (categoryId) {
      params = params.set('categoryId', categoryId.toString());
    }
    if (branchId) {
      params = params.set('branchId', branchId.toString());
    }
    if (name) {
      params = params.set('name', name);
    }

    return this.http.get(`${this.URL}/api/Item/GetbyName`, { params });
  }
}
