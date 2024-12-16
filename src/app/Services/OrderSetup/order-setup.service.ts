import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OrderSetupService {
  private URL = environment.API_KEY;

  constructor(private http: HttpClient) { }

  // GET method to fetch the order setup
  getOrderSetup(): Observable<any> {
    return this.http.get<any>(`${this.URL}/api/OrderSetup`);
  }

  // PUT method to update the order setup
  updateOrderSetup(orderSetup: {
    foodPreparationTime: number;
    scheduleOrderSlotDuration: number;
    freeDeliveryKilometer: number;
    basicDeliveryCharge: number;
    chargePerKilo: number;
    isTakeawayEnabled: boolean;
    isDeliveryEnabled: boolean;
  }): Observable<any> {
    return this.http.put<any>(`${this.URL}/api/OrderSetup/Update`, orderSetup);
  }
}
