package com.consdev.mediportal.dto.medicalhistorydto;

public class ReviewPrescriptionRequestRequest {
    private String status;   // APPROVED / REJECTED / FULFILLED
    private String adminNote;
    private String decidedBy;

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAdminNote() { return adminNote; }
    public void setAdminNote(String adminNote) { this.adminNote = adminNote; }

    public String getDecidedBy() { return decidedBy; }
    public void setDecidedBy(String decidedBy) { this.decidedBy = decidedBy; }
}