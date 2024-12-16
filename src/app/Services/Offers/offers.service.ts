import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OffersService {
  private URL = environment.API_KEY;

  constructor(private http: HttpClient) { }

  // GET /api/Offers/GetOffers
  getOffers(): Observable<any> {
    return this.http.get(`${this.URL}/api/Offers/GetOffers`, {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    });
  }

  // GET /api/Offers/{id}
  getOfferById(id: number): Observable<any> {
    return this.http.get(`${this.URL}/api/Offers/${id}`, {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    });
  }

  // DELETE /api/Offers/{id}
  deleteOffer(id: number): Observable<any> {
    return this.http.delete(`${this.URL}/api/Offers/delete-offer/${id}`);
  }

  // GET /api/Offers/GetOffersWithFilteration
  getOffersWithFilter(
    name?: string,
    status?: number,
    startDate?: string,
    endDate?: string,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<any> {
    let params: Record<string, string> = { pageNumber: '1', pageSize: '10' };

    if (name) {
      params = { ...params, name };
    }

    if (status != null) {
      params = { ...params, status: status.toString() };
    }

    if (startDate) {
      params = { ...params, startDate };
    }

    if (endDate) {
      params = { ...params, endDate };
    }

    params = { ...params, pageNumber: pageNumber.toString() };

    return this.http.get(`${this.URL}/api/Offers/get-offers-with-filter`, { params });
  }

  // Update offer
  updateOffer(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.URL}/api/Offers/${id}`, formData);
  }

  // Create offer
  createOffer(formData: FormData): Observable<any> {
    return this.http.post(`${this.URL}/api/Offers/create-offer`, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error occurred while creating offer:', error);
        // Log error details for further investigation
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        return throwError(() => new Error('Failed to create offer'));
      })
    );
  }

  // Update image
  updateImage(id: number, imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('imageFile', imageFile);

    return this.http.put(`${this.URL}/api/Offers/${id}/update-image`, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error occurred while updating image:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        return throwError(() => new Error('Failed to update image'));
      })
    );
  }

  // DELETE /api/Offers/{offerId}/items/remove
  removeItemsFromOffer(offerId: number): Observable<any> {
    return this.http.delete(`${this.URL}/api/Offers/${offerId}/items/remove`);
  }

  // DELETE /api/Offers/{offerId}/categories/remove
  removeCategoriesFromOffer(offerId: number): Observable<any> {
    return this.http.delete(`${this.URL}/api/Offers/${offerId}/categories/remove`);
  }
}
