import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:8080/api/admin';

export type PatientCreateRequest = {
  firstName: string;
  lastName: string;
  dateOfBirth: string; // yyyy-mm-dd
  gender: string;
  address: string;
  phoneNumber: string;
  email: string;
};

export interface PatientUpdateRequest  {
  firstName: string;
  lastName: string;
  dateOfBirth: string; 
  gender: string;
  address: string;
  phoneNumber: string;
  email: string
}

export type PatientUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  phoneNumber?: string;
};

@Injectable({ providedIn: 'root' })
export class PatientService {
  constructor(private http: HttpClient) {}

  createPatient(payload: PatientCreateRequest) {
    return this.http.post<PatientUser>(`${baseUrl}/patients`, payload, { withCredentials: true });
  }

  updatePatient(id: string, payload: PatientUpdateRequest){
    return this.http.put<PatientUser>(`${baseUrl}/patients`, payload,{ withCredentials: true });
  }

  findPatient(email: string, dateOfBirth: string)
  {
    return this.http.get<PatientUser>(
      `${baseUrl}/patients/find?email=${encodeURIComponent(email)}&dateOfBirth=${dateOfBirth}`,
      {withCredentials: true}
    )
  }

  getPatients() {
  return this.http.get<PatientUser[]>(
    `${baseUrl}/patients`,{ withCredentials: true }
  );
}
}
