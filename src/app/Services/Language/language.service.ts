import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private URL = environment.API_KEY;

  constructor(private http: HttpClient) { }

  // POST: Create a new language
  createLanguage(languageData: FormData): Observable<any> {
    return this.http.post(`${this.URL}/api/Language`, languageData);
  }

  // GET: Fetch all languages
  getAllLanguages(): Observable<any> {
    return this.http.get(`${this.URL}/api/Language`);
  }

  // GET: Fetch a specific language by ID
  getLanguageById(id: number): Observable<any> {
    return this.http.get(`${this.URL}/api/Language/${id}`);
  }

  // PUT: Update a language by ID
  updateLanguage(id: number, languageData: FormData): Observable<any> {
    return this.http.put(`${this.URL}/api/Language/${id}`, languageData);
  }

  // DELETE: Delete a language by ID
  deleteLanguage(id: number): Observable<any> {
    return this.http.delete(`${this.URL}/api/Language/${id}`);
  }
}
