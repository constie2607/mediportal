import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';



  // ✅ Types live INSIDE the service (no separate model file)
  export type TimelineType = 'TRIAGE' | 'APPOINTMENT' | 'PRESCRIPTION' | 'NOTE';

  export interface TimelineItemDTO {
    type: TimelineType;
    dateTime: string;     // ISO string from backend
    title: string;
    status?: string | null;
    refId?: string | null; // triageId like "trg-12345"
    clinicianName?: string | null;
  }
  export interface MedicationDTO {
  id: number;
  medicationName: string;
  dosage?: string | null;
  frequency?: string | null;
  route?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  status?: 'ACTIVE' | 'STOPPED' | 'COMPLETED' | string | null;
  indication?: string | null;
  instructions?: string | null;
  prescribedBy?: string | null;
  notes?: string | null;
}

export interface PrescriptionRequestDTO {
  id: number;
  requestRef?: string | null;
  medicationName: string;
  requestedDosage?: string | null;
  requestType?: 'REPEAT' | 'NEW' | string | null;
  reason?: string | null;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FULFILLED' | string | null;
  adminNote?: string | null;
  requestedAt?: string | null;
  decidedAt?: string | null;
  decidedBy?: string | null;
}

  export interface AllergyDTO {
    id: string;
    allergen: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | string;
    reaction?: string | null;
    notes?: string | null;
  }

  export interface MedicalConditionDTO {
   id: number;
  name: string;
  diagnosedDate?: string | null;
  status?: 'ACTIVE' | 'RESOLVED' | string | null;
  notes?: string | null;
    
  }

  export interface ProcedureDTO {
    id: string;
    procedureName: string;
    procedureDate?: string | null;
    hospital?: string | null;
    notes?: string | null;
  }

  export interface FamilyHistoryDTO {
    id: string;
    relative: string;
    conditionName: string;
    ageOfOnset?: number | null;
    notes?: string | null;
  }

  export interface SocialHistoryDTO {
    smokingStatus?: string | null;
    alcoholUse?: string | null;
    exerciseLevel?: string | null;
    occupation?: string | null;
    notes?: string | null;
  }

  export interface MedicalHistoryOverviewDto {
      userId: string;
  patientName: string;
  dateOfBirth: string | null;
  nhsNumber: string | null;
    allergies: AllergyDTO[];
    conditions: MedicalConditionDTO[];
    procedures: ProcedureDTO[];
    familyHistory: FamilyHistoryDTO[];
    socialHistory?: SocialHistoryDTO | null;
    timeline: TimelineItemDTO[];
    medications: MedicationDTO[];
  prescriptionRequests: PrescriptionRequestDTO[];
  }
@Injectable({ providedIn: 'root' })
export class MedicalHistoryService {
  private readonly baseUrl = 'http://localhost:8080/api/users';

constructor(private http: HttpClient) {}

  getMedicalHistory(userId: string | number): Observable<MedicalHistoryOverviewDto> {
    return this.http.get<MedicalHistoryOverviewDto>(`${this.baseUrl}/${userId}/medical-history`);
  }

addAllergy(userId: string, payload: {
  allergen: string;
  severity: string;
  reaction?: string | null;
  notes?: string | null;
}) {
  return this.http.post(`${this.baseUrl}/${userId}/medical-history/allergies`, payload);
}

updateAllergy(userId: string, allergyId: number, payload: {
  allergen: string;
  severity: string;
  reaction?: string | null;
  notes?: string | null;
}) {
  return this.http.put(`${this.baseUrl}/${userId}/medical-history/allergies/${allergyId}`, payload);
}

deleteAllergy(userId: string, allergyId: number) {
  return this.http.delete(`${this.baseUrl}/${userId}/medical-history/allergies/${allergyId}`);
}

addCondition(userId: string, payload: {
  name: string;
  diagnosedDate?: string | null;
  status: string;
  notes?: string | null;
}) {
  return this.http.post(`${this.baseUrl}/${userId}/medical-history/conditions`, payload);
}

updateCondition(userId: string, conditionId: number, payload: {
  name: string;
  diagnosedDate?: string | null;
  status: string;
  notes?: string | null;
}) {
  return this.http.put(`${this.baseUrl}/${userId}/medical-history/conditions/${conditionId}`, payload);
}

deleteCondition(userId: string, conditionId: number) {
  return this.http.delete(`${this.baseUrl}/${userId}/medical-history/conditions/${conditionId}`);
}

addProcedure(userId: string, payload: {
  procedureName: string;
  procedureDate?: string | null;
  hospital?: string | null;
  notes?: string | null;
}) {
  return this.http.post(`${this.baseUrl}/${userId}/medical-history/procedures`, payload);
}

updateProcedure(userId: string, procedureId: number, payload: {
  procedureName: string;
  procedureDate?: string | null;
  hospital?: string | null;
  notes?: string | null;
}) {
  return this.http.put(`${this.baseUrl}/${userId}/medical-history/procedures/${procedureId}`, payload);
}

deleteProcedure(userId: string, procedureId: number) {
  return this.http.delete(`${this.baseUrl}/${userId}/medical-history/procedures/${procedureId}`);
}

addFamilyHistory(userId: string, payload: {
  relative: string;
  conditionName: string;
  ageOfOnset?: number | null;
  notes?: string | null;
}) {
  return this.http.post(`${this.baseUrl}/${userId}/medical-history/family-history`, payload);
}

updateFamilyHistory(userId: string, familyHistoryId: number, payload: {
  relative: string;
  conditionName: string;
  ageOfOnset?: number | null;
  notes?: string | null;
}) {
  return this.http.put(`${this.baseUrl}/${userId}/medical-history/family-history/${familyHistoryId}`, payload);
}

deleteFamilyHistory(userId: string, familyHistoryId: number) {
  return this.http.delete(`${this.baseUrl}/${userId}/medical-history/family-history/${familyHistoryId}`);
}

updateSocialHistory(userId: string, payload: {
  smokingStatus?: string | null;
  alcoholUse?: string | null;
  exerciseLevel?: string | null;
  occupation?: string | null;
  notes?: string | null;
}) {
  return this.http.put(`${this.baseUrl}/${userId}/medical-history/social-history`, payload);
}

addMedication(userId: string, payload: {
  medicationName: string;
  dosage?: string | null;
  frequency?: string | null;
  route?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  status?: string | null;
  indication?: string | null;
  instructions?: string | null;
  prescribedBy?: string | null;
  notes?: string | null;
}) {
  return this.http.post(`${this.baseUrl}/${userId}/medical-history/medications`, payload);
}

updateMedication(userId: string, medicationId: number, payload: {
  medicationName: string;
  dosage?: string | null;
  frequency?: string | null;
  route?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  status?: string | null;
  indication?: string | null;
  instructions?: string | null;
  prescribedBy?: string | null;
  notes?: string | null;
}) {
  return this.http.put(`${this.baseUrl}/${userId}/medical-history/medications/${medicationId}`, payload);
}

deleteMedication(userId: string, medicationId: number) {
  return this.http.delete(`${this.baseUrl}/${userId}/medical-history/medications/${medicationId}`);
}

createPrescriptionRequest(userId: string, payload: {
  medicationName: string;
  requestedDosage?: string | null;
  requestType: string;
  reason?: string | null;
}) {
  return this.http.post(`${this.baseUrl}/${userId}/medical-history/prescription-requests`, payload);
}

reviewPrescriptionRequest(requestId: number, payload: {
  status: string;
  adminNote?: string | null;
  decidedBy?: string | null;
}) {
  return this.http.put(`${this.baseUrl}/prescription-requests/${requestId}/review`, payload);
}


getPatientMedicationPage(userId: string) {
  return this.getMedicalHistory(userId);
}
}