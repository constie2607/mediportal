import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:8080';

export interface PatientProfileDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  address?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
}

export interface UpdatePatientProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  address?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
}

@Injectable({ providedIn: 'root' })
export class PatientProfileService {
  constructor(private http: HttpClient) {}

  getMyProfile(): Observable<PatientProfileDto> {
    return this.http.get<PatientProfileDto>(`${baseUrl}/api/patient/profile`, {
      withCredentials: true
    });
  }

  updateMyProfile(payload: UpdatePatientProfileRequest): Observable<PatientProfileDto> {
    return this.http.put<PatientProfileDto>(`${baseUrl}/api/patient/profile`, payload, {
      withCredentials: true
    });
  }
}