package com.consdev.mediportal.dto.medicalhistorydto;

import java.time.LocalDateTime;

public class PrescriptionRequestDto {
    private Long id;
    private String requestRef;
    private String medicationName;
    private String requestedDosage;
    private String requestType;
    private String reason;
    private String status;
    private String adminNote;
    private LocalDateTime requestedAt;
    private LocalDateTime decidedAt;
    private String decidedBy;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRequestRef() { return requestRef; }
    public void setRequestRef(String requestRef) { this.requestRef = requestRef; }

    public String getMedicationName() { return medicationName; }
    public void setMedicationName(String medicationName) { this.medicationName = medicationName; }

    public String getRequestedDosage() { return requestedDosage; }
    public void setRequestedDosage(String requestedDosage) { this.requestedDosage = requestedDosage; }

    public String getRequestType() { return requestType; }
    public void setRequestType(String requestType) { this.requestType = requestType; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAdminNote() { return adminNote; }
    public void setAdminNote(String adminNote) { this.adminNote = adminNote; }

    public LocalDateTime getRequestedAt() { return requestedAt; }
    public void setRequestedAt(LocalDateTime requestedAt) { this.requestedAt = requestedAt; }

    public LocalDateTime getDecidedAt() { return decidedAt; }
    public void setDecidedAt(LocalDateTime decidedAt) { this.decidedAt = decidedAt; }

    public String getDecidedBy() { return decidedBy; }
    public void setDecidedBy(String decidedBy) { this.decidedBy = decidedBy; }
}