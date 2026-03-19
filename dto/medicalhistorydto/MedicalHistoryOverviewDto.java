package com.consdev.mediportal.dto.medicalhistorydto;
import java.time.LocalDate;
import java.util.List;

public class MedicalHistoryOverviewDto {
    private String userId;

    private List<AllergyDto> allergies;
    private List<MedicalConditionDto> conditions;
    private List<ProcedureDto> procedures;
    private List<FamilyHistoryDto> familyHistory;
    private SocialHistoryDto socialHistory;
    private List<TimelineItemDto> timeline;
    private String patientName;
    private LocalDate dateOfBirth;
    private List<MedicationDto> medications;
    private List<PrescriptionRequestDto> prescriptionRequests;
//    private String nhsNumber;

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public List<AllergyDto> getAllergies() { return allergies; }
    public void setAllergies(List<AllergyDto> allergies) { this.allergies = allergies; }

    public List<MedicalConditionDto> getConditions() { return conditions; }
    public void setConditions(List<MedicalConditionDto> conditions) { this.conditions = conditions; }

    public List<ProcedureDto> getProcedures() { return procedures; }
    public void setProcedures(List<ProcedureDto> procedures) { this.procedures = procedures; }

    public List<FamilyHistoryDto> getFamilyHistory() { return familyHistory; }
    public void setFamilyHistory(List<FamilyHistoryDto> familyHistory) { this.familyHistory = familyHistory; }

    public SocialHistoryDto getSocialHistory() { return socialHistory; }
    public void setSocialHistory(SocialHistoryDto socialHistory) { this.socialHistory = socialHistory; }

    public List<TimelineItemDto> getTimeline() { return timeline; }
    public void setTimeline(List<TimelineItemDto> timeline) { this.timeline = timeline; }

    public String getPatientName() {return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName;}

    public LocalDate getDateOfBirth() {return dateOfBirth;}
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth;}

    public List<MedicationDto> getMedications() { return medications; }
    public void setMedications(List<MedicationDto> medications) { this.medications = medications; }

    public List<PrescriptionRequestDto> getPrescriptionRequests() { return prescriptionRequests; }
    public void setPrescriptionRequests(List<PrescriptionRequestDto> prescriptionRequests) { this.prescriptionRequests = prescriptionRequests; }
}