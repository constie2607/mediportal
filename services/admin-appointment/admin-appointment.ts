import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:8080/api/admin';

export type DoctorDto = { id: string; name: string; email?: string | null };
export type AvailabilitySlot = { startIso: string; available: boolean };

export type AvailabilityResponse = {
  doctorId: string;
  from: string;
  to: string;
  slotMinutes: number;
  slots: AvailabilitySlot[];
};

export type BackendDoctor = {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
};


@Injectable({ providedIn: 'root' })
export class AdminAppointmentsService {
  constructor(private http: HttpClient) {}

  listDoctors(): Observable<DoctorDto[]> {
    return this.http.get<DoctorDto[]>(`${baseUrl}/doctors`, { withCredentials: true });
  }
 

doctors(): Observable<BackendDoctor[]> {
  return this.http.get<BackendDoctor[]>(`${baseUrl}/schedule/doctors`, {
    withCredentials: true
  });
}
  availability(doctorId: string, from: string, to: string, slotMinutes = 30): Observable<AvailabilityResponse> {
    return this.http.get<AvailabilityResponse>(`${baseUrl}/availability`, {
      withCredentials: true,
      params: { doctorId, from, to, slotMinutes }
    });
  }

  book(payload: {
    triageId: string;
    doctorId: string;
    dateTime: string; // yyyy-MM-ddTHH:mm
    type: string;
    note?: string;
  }): Observable<any> {
    return this.http.post(`${baseUrl}/appointments/book`, payload, { withCredentials: true });
  }

    listDoctorWeek(doctorId: string, from: string, to: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${baseUrl}/api/admin/appointments`,
      { params: { doctorId, from, to }, withCredentials: true }
    );
  }

  getWeekAppointments(doctorId: string, from: string, to: string) {
  return this.http.get<any[]>(`http://localhost:8080/api/admin/appointments`, {
    withCredentials: true,
    params: { doctorId, from, to }
  });
}
}