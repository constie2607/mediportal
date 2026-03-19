package com.consdev.mediportal.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

@Entity
public class Appointment {

    @Id
    private String appointmentId;

    private String userId;

    private LocalDateTime dateTime;

    private String type; // PHONE / IN_PERSON / VIDEO

    private String note;

    private LocalDateTime createdAt;

    @Column(length = 64)
    private String doctorId;

    @Column(length = 64)
    private String triageId;

    // getters/setters
    public String getAppointmentId() { return appointmentId; }
    public void setAppointmentId(String appointmentId) { this.appointmentId = appointmentId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public LocalDateTime getDateTime() { return dateTime; }
    public void setDateTime(LocalDateTime dateTime) { this.dateTime = dateTime; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getTriageId() { return triageId; }
    public void setTriageId(String triageId) { this.triageId = triageId; }
}
