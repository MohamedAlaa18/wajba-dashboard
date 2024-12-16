import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private authTokenSubject = new BehaviorSubject<string | null>(null);
  authToken$: Observable<string | null> = this.authTokenSubject.asObservable();

  decodeToken(token: string): any {
    if (!token) {
      return null;
    }

    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return null;
    }

    const payload = tokenParts[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  }

  getUserIdFromToken(token: string): string | null {
    const decodedToken = this.decodeToken(token);
    return decodedToken ? decodedToken.customerId : null;
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof sessionStorage !== 'undefined';
  }

  getToken(): string | null {
    if (this.isBrowser()) {
      return sessionStorage.getItem('authToken');
    }
    return null;
  }

  saveToken(token: string): void {
    if (this.isBrowser()) {
      sessionStorage.setItem('authToken', token);
    }
  }

  setToken(token: string | null): void {
    if (this.isBrowser()) {
      if (token) {
        sessionStorage.setItem('authToken', token);
      } else {
        sessionStorage.removeItem('authToken');
      }
      this.authTokenSubject.next(token);
    }
  }
}
