import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type ScheduleType = 'AVAILABLE' | 'TIME_OFF';

export type DoctorSchedule = {
  id: number;
  doctorId: string;
  date: string; // YYYY-MM-DD
  type: ScheduleType;
  startTime?: string | null; // "09:00:00" or "09:00"
  endTime?: string | null;
  note?: string | null;
};

export type BulkScheduleRequest = {
  doctorId: string;
  type: ScheduleType;
  startTime?: string; // "09:00"
  endTime?: string;   // "17:00"
  note?: string;
  dates: string[];    // ["YYYY-MM-DD", ...]
};

@Injectable({ providedIn: 'root' })
export class AdminAvailabilityService {
  private baseUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  week(from: string, to: string): Observable<DoctorSchedule[]> {
    return this.http.get<DoctorSchedule[]>(`${this.baseUrl}/schedule`, {
      withCredentials: true,
      params: { from, to }
    });
  }

  bulk(payload: BulkScheduleRequest): Observable<DoctorSchedule[]> {
    return this.http.post<DoctorSchedule[]>(`${this.baseUrl}/schedule/bulk`, payload, {
      withCredentials: true
    });
  }

  doctors(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/schedule/doctors`, { withCredentials: true });
}
}