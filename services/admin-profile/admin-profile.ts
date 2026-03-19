import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:8080';

export interface AdminProfileDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  role?: string | null;
  department?: string | null;
  address?: string | null;
}

export interface UpdateAdminProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  address?: string | null;
}

@Injectable({ providedIn: 'root' })
export class AdminProfileService {
  constructor(private http: HttpClient) {}

  getMyProfile(): Observable<AdminProfileDto> {
    return this.http.get<AdminProfileDto>(`${baseUrl}/api/admin/profile`, {
      withCredentials: true
    });
  }

  updateMyProfile(payload: UpdateAdminProfileRequest): Observable<AdminProfileDto> {
    return this.http.put<AdminProfileDto>(`${baseUrl}/api/admin/profile`, payload, {
      withCredentials: true
    });
  }
}