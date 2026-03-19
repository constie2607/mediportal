package com.consdev.mediportal.dto.medicalhistorydto;

import java.time.LocalDate;

public class MedicationDto {
    private Long id;
    private String medicationName;
    private String dosage;
    private String frequency;
    private String route;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private String indication;
    private String instructions;
    private String prescribedBy;
    private String notes;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMedicationName() { return medicationName; }
    public void setMedicationName(String medicationName) { this.medicationName = medicationName; }

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public String getRoute() { return route; }
    public void setRoute(String route) { this.route = route; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getIndication() { return indication; }
    public void setIndication(String indication) { this.indication = indication; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public String getPrescribedBy() { return prescribedBy; }
    public void setPrescribedBy(String prescribedBy) { this.prescribedBy = prescribedBy; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}