package com.consdev.mediportal.dto;

public class CloseTriageRequest {
    private String reason; // REQUIRED
    private String note;   // optional

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
