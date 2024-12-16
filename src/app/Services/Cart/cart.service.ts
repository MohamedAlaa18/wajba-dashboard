import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  token: string
  URL = environment.API_KEY;

  private cartIsOpenSubject = new BehaviorSubject<boolean>(false);
  cartIsOpen$: Observable<boolean> = this.cartIsOpenSubject.asObservable();

  // New BehaviorSubject to hold the cart data
  private cartSubject = new BehaviorSubject<any | null>(null);
  cart$: Observable<any> = this.cartSubject.asObservable();

  constructor(
    private httpClient: HttpClient,
  ) {
    this.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJpYnJhaGVtbWFsZWs4OTRAZ21haWwuY29tIiwianRpIjoiZDVhZWE5MTEtZGU5Ny00MDJjLWFkYzQtNGJjMWNlYTk3OWJmIiwibmFtZSI6IklicmFoZW0iLCJlbWFpbCI6ImlicmFoZW1tYWxlazg5NEBnbWFpbC5jb20iLCJJZCI6IjEiLCJwaG9uZSI6IjAxMDAzMzAzMTQxIiwiVXNlclR5cGUiOiJFbXBsb3llZSIsImV4cCI6MTc2MTUzMTMxMiwiaXNzIjoiaHR0cHM6Ly9mb29kb3JkZXIucnVuYXNwLm5ldC8iLCJhdWQiOiJodHRwczovL2Zvb2RvcmRlci5ydW5hc3AubmV0LyJ9.8UkjnsT1e-4c80Me2RLKrBbPmvmwHRS9xnoO_ZZhvg0'
  }

  setCartIsOpen(state: boolean): void {
    this.cartIsOpenSubject.next(state);
  }

  // Method to get cart data (either from cache or API)
  getCart(): Observable<any> {
    // const token = this.jwtService.getToken();

    if (!this.token) {
      console.error("Token is missing or invalid.");
      return throwError("Token is missing or invalid.");
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    // Check if cart data is already fetched and cached
    if (this.cartSubject.getValue()) {
      return this.cart$;  // Return the cached cart data as an Observable
    }

    // If not fetched yet, make an API call and update the cartSubject
    return this.httpClient.get(`${this.URL}/api/PosCart/get-cart`, { headers })
      .pipe(
        tap(cartData => this.cartSubject.next(cartData)),
        catchError(error => {
          console.error("Error fetching cart items:", error);
          return throwError(error);
        })
      );
  }

  getSavedCart(): any {
    return this.cartSubject.getValue();
  }

  updateCartItem(cartItemId: number, itemData: {
    itemId: number;
    itemName: string;
    quantity: number;
    notes: string;
    price: number;
    variations: { name: string; additionalPrice: number; attributeName: string }[];
    addons: { name: string; price: number }[];
    extras: { name: string; additionalPrice: number }[];
  }): Observable<any> {
    // const token = this.jwtService.getToken();

    if (!this.token) {
      console.error("Token is missing or invalid.");
      return throwError("Token is missing or invalid.");
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    return this.httpClient.put(`${this.URL}/api/PosCart/update-item/${cartItemId}`, itemData, { headers })
      .pipe(
        catchError(error => {
          console.error("Error updating cart item:", error);
          return throwError(error);
        })
      );
  }

  clearCart(): Observable<any> {
    // const token = this.jwtService.getToken();

    if (!this.token) {
      console.error("Token is required.");
      return throwError("Token is required.");
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'accept': '*/*'
    });

    return this.httpClient.delete(`${this.URL}/api/PosCart/clear-cart`, { headers })
      .pipe(
        tap(() => this.cartSubject.next(null)),  // Clear the cached cart data
        catchError(error => {
          console.error("Error clearing cart:", error);
          return throwError(error);
        })
      );
  }

  updateCartItemQuantity(cartItemId: number, quantityChange: number): Observable<any> {
    // const token = this.jwtService.getToken();
    if (!this.token) {
      console.error("Token is missing or invalid.");
      return throwError("Token is missing or invalid.");
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    const requestBody = {
      cartItemId,
      quantityChange
    };

    return this.httpClient.post(`${this.URL}/api/PosCart/update-cartitem-quantity`, requestBody, { headers })
      .pipe(
        catchError(error => {
          console.error("Error updating cart item quantity:", error);
          return throwError(error);
        })
      );
  }

  getCartItemById(itemId: number): Observable<any> {
    return this.httpClient.get(`${this.URL}/api/PosCart/Get-Items-In-cart/${itemId}`);
  }

  addItemToCart(item: {
    itemId: number;
    itemName: string;
    quantity: number;
    notes: string;
    price: number;
    variations: { name: string; additionalPrice: number; attributeName: string }[];
    addons: { name: string; price: number }[];
    extras: { name: string; additionalPrice: number }[];
  }): Observable<any> {
    // const token = this.jwtService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.httpClient.post(`${this.URL}/api/PosCart/add-item-to-cart`, item, { headers });
  }

  deleteCartItemById(cartItemId: number): Observable<void> {
    // const token = this.jwtService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.httpClient.delete<void>(`${this.URL}/api/PosCart/delete-item-from-cart/${cartItemId}`, { headers });
  }

  cartIsOpen(): boolean {
    return this.cartIsOpenSubject.getValue();
  }

  checkout(note: string): Observable<any> {
    // const token = this.jwtService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    const body = { note };
    return this.httpClient.post<any>(`${this.URL}/api/PosCart/checkout`, body, { headers });
  }

  applyVoucherCode(discountType: number, amount: number): Observable<any> {
    if (!this.token) {
      console.error("Token is missing or invalid.");
      return throwError("Token is missing or invalid.");
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    const body = {
      discountType: Number(discountType),
      amount: Number(amount)
    };

    return this.httpClient.post(`${this.URL}/api/PosCart/apply-voucher-code`, body, { headers })
  }
}
