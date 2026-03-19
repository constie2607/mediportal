import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AiSymptompiService {
  private base = 'http://localhost:8080/api/patient/triage-requests';

  constructor(private http: HttpClient) {}

  createTriageRequest(payload: any): Observable<any> {
    return this.http.post<any>(this.base, payload, { withCredentials: true });
    // If you use Authorization Bearer instead of cookies, remove withCredentials and set interceptor
  }

  listMyRequests(): Observable<any[]> {
    return this.http.get<any[]>(this.base, { withCredentials: true });
  }
}
