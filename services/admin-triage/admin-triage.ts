import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type TriageStatus =
  | 'PENDING'
  | 'CALL_ATTEMPTED'
  | 'APPOINTMENT_ASSIGNED'
  | 'CLOSED_NO_APPOINTMENT';

// ✅ Type the triage object (no more `any`)
export type AdminTriage = {
  triageId: string;
  status: TriageStatus;

  problem: string;
  duration: string;
  tried?: string | null;
  worried?: string | null;
  helpWanted?: string | null;
  bestTimes?: string | null;

  createdAt?: string | null;

  // CALL HISTORY
  callLogs?: {
    calledAt: string;
    note: string;
  }[];

  // CLOSE DETAILS
  closeReason?: 'BOOKINGS_FULL' | 'APPOINTMENT_NOT_NEEDED' | 'OTHER' | null;
  closeNote?: string | null;
  closedAt?: string | null;
};


export type AdminTriageView = {
  patient: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phoneNumber: string | null;
    dateOfBirth: string | null;
  };
  triage: AdminTriage;
};

@Injectable({ providedIn: 'root' })
export class AdminTriageService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // ✅ Return type is explicit + status is typed
  list(status?: TriageStatus): Observable<AdminTriageView[]> {
    const options: { withCredentials: boolean; params?: any } = { withCredentials: true };
    if (status) options.params = { status };

    return this.http.get<AdminTriageView[]>(`${this.baseUrl}/admin/triage-requests`, options);
  }

  getOne(triageId: string): Observable<AdminTriageView> {
    return this.http.get<AdminTriageView>(
      `${this.baseUrl}/admin/triage-requests/${triageId}`,
      { withCredentials: true }
    );
  }

  updateStatus(triageId: string, status: TriageStatus): Observable<any> {
    return this.http.patch<any>(
      `${this.baseUrl}/admin/triage-requests/${triageId}/status`,
      { status },
      { withCredentials: true }
    );
  }

 logCall(triageId: string, note: string) {
  return this.http.post<AdminTriageView>(
    `${this.baseUrl}/admin/triage-requests/${triageId}/call`,
    { note },
    { withCredentials: true }
  );
}

  assignAppointment(
    triageId: string,
    payload: { dateTime: string; type: 'PHONE' | 'IN_PERSON' | 'VIDEO'; note?: string }
  ): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/admin/triage-requests/${triageId}/assign-appointment`,
      payload,
      { withCredentials: true }
    );
  }

// closeNoAppointment(triageId: string, payload: 
//   { reason: 'BOOKINGS_FULL'|'APPOINTMENT_NOT_NEEDED'|'OTHER'; note?: string }) {
//   return this.http.post<AdminTriageView>(
//     `${this.baseUrl}/admin/triage-requests/${triageId}/close`,
//     payload,
//     { withCredentials: true }
//   );
// }

closeNoAppointment(triageId: string, payload: { reason: string; note?: string }) {
  return this.http.post(
    `${this.baseUrl}/admin/triage-requests/${triageId}/close`,
    payload,
    { withCredentials: true }
  );
}


  
}
