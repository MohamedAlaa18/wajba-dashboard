import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { IWeekDayTimeSlot } from '../../Models/itime-slot';

@Injectable({
  providedIn: 'root'
})
export class TimeSlotService {
  private URL = `${environment.API_KEY}`;

  constructor(private http: HttpClient) { }

  getTimeSlots(): Observable<any> {
    return this.http.get(`${this.URL}/api/TimeSlot/get-timeslots`);
  }

  updateTimeSlots(timeSlots: IWeekDayTimeSlot[]): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.URL}/api/TimeSlot/update-timeslots`, timeSlots, { headers });
  }
}
