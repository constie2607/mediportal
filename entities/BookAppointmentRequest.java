package com.consdev.mediportal.entities;

public class BookAppointmentRequest {
    private String triageId;
    private String doctorId;
    private String dateTime; // ISO e.g. 2026-02-20T14:30
    private String type;     // PHONE / VIDEO / IN_PERSON
    private String note;

    public String getTriageId() { return triageId; }
    public void setTriageId(String triageId) { this.triageId = triageId; }

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getDateTime() { return dateTime; }
    public void setDateTime(String dateTime) { this.dateTime = dateTime; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}