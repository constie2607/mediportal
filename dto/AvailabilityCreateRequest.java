package com.consdev.mediportal.dto;

public class AvailabilityCreateRequest {
    private String doctorId;
    private String startTime; // ISO: 2026-02-20T09:00
    private String endTime;   // ISO: 2026-02-20T09:30
    private String status;    // AVAILABLE/BLOCKED
    private String note;

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}