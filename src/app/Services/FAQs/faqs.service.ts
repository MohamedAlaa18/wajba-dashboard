import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FAQsService {

  private URL = `${environment.API_KEY}`;

  constructor(private http: HttpClient) { }

  // Method to get a specific FAQ by its ID
  getFAQById(id: number): Observable<any> {
    return this.http.get<any>(`${this.URL}/api/FAQs/${id}`);
  }

  // Method to update a specific FAQ by its ID
  updateFAQ(id: number, faqData: { question: string, answer: string }): Observable<any> {
    return this.http.put<any>(`${this.URL}/api/FAQs/${id}`, faqData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Method to delete an FAQ by its ID
  deleteFAQ(id: number): Observable<any> {
    return this.http.delete<any>(`${this.URL}/${id}`);
  }

  // Method to create a new FAQ (or multiple FAQs)
  createFAQs(faqs: { question: string, answer: string }[]): Observable<any> {
    return this.http.post<any>(`${this.URL}/api/FAQs`, faqs, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Method to fetch all FAQs
  getAllFAQs(): Observable<any> {
    return this.http.get<any>(`${this.URL}/api/FAQs`);
  }
}
