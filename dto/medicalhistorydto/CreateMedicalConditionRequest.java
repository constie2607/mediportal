package com.consdev.mediportal.dto.medicalhistorydto;

import java.time.LocalDate;

public class CreateMedicalConditionRequest {
    private String name;
    private LocalDate diagnosedDate;
    private String status;
    private String notes;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public LocalDate getDiagnosedDate() { return diagnosedDate; }
    public void setDiagnosedDate(LocalDate diagnosedDate) { this.diagnosedDate = diagnosedDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}