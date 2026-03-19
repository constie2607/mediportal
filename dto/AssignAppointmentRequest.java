package com.consdev.mediportal.dto;

public class AssignAppointmentRequest {
    private String doctorId;
    private String triageId;
    private String dateTime; // ISO string e.g. "2026-02-12T14:30"
    private String type;     // PHONE / IN_PERSON / VIDEO
    private String note;


    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getTriageId() { return triageId; }
    public void setTriageId(String triageId) { this.triageId = triageId; }

    public String getDateTime() { return dateTime; }
    public void setDateTime(String dateTime) { this.dateTime = dateTime; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
