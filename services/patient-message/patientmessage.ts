import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type PatientMessage = {
  id: number;
  toUserId: string;
  fromUser: string;
  subject: string;
  body: string;
  readFlag: boolean;
  createdAt: string;      // ISO string
  appointmentId?: string | null;
};

@Injectable({ providedIn: 'root' })
export class PatientMessagesService {
  private baseUrl = 'http://localhost:8080/api/patient/messages';

  constructor(private http: HttpClient) {}

  list(): Observable<PatientMessage[]> {
    return this.http.get<PatientMessage[]>(this.baseUrl, { withCredentials: true });
  }

  unreadCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/unread-count`, { withCredentials: true });
  }

  markRead(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/read`, {}, { withCredentials: true });
  }
}