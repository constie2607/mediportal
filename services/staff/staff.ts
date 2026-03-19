import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type StaffUser = {
  id: string;
  email: string;
  address: string;
  dateOfBirth: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role: string;
};

export type StaffCreateRequest = {
  email: string;
  address: string;
  dateOfBirth: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role: string;
};

export type StaffUpdateRequest = StaffCreateRequest;

@Injectable({ providedIn: 'root' })
export class StaffService {
  private baseUrl = 'http://localhost:8080/api/';

  constructor(private http: HttpClient) {}

  getStaff(): Observable<StaffUser[]> {
    return this.http.get<StaffUser[]>(`${this.baseUrl}admin/staff`, { withCredentials: true });
  }

  createStaff(req: StaffCreateRequest): Observable<StaffUser> {
    return this.http.post<StaffUser>(`${this.baseUrl}admin/staff`, req, { withCredentials: true });
  }

  updateStaff(id: string, req: StaffUpdateRequest): Observable<StaffUser> {
    return this.http.put<StaffUser>(`${this.baseUrl}admin/staff/${id}`, req, { withCredentials: true });
  }

  deleteStaff(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}admin/staff/${id}`, { withCredentials: true });
  }
}
