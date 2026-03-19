package com.consdev.mediportal.entities;

import com.consdev.mediportal.enums.PrescriptionRequestStatus;
import com.consdev.mediportal.enums.PrescriptionRequestType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "prescription_request")
public class PrescriptionRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "request_ref", unique = true, length = 30)
    private String requestRef;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(name = "medication_name", nullable = false, length = 160)
    private String medicationName;

    @Column(length = 100)
    private String requestedDosage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PrescriptionRequestType requestType;

    @Column(length = 800)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PrescriptionRequestStatus status = PrescriptionRequestStatus.PENDING;

    @Column(length = 800)
    private String adminNote;

    @CreationTimestamp
    @Column(name = "requested_at", nullable = false, updatable = false)
    private LocalDateTime requestedAt;

    private LocalDateTime decidedAt;

    @Column(length = 120)
    private String decidedBy;

    public Long getId() { return id; }

    public String getRequestRef() { return requestRef; }
    public void setRequestRef(String requestRef) { this.requestRef = requestRef; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getMedicationName() { return medicationName; }
    public void setMedicationName(String medicationName) { this.medicationName = medicationName; }

    public String getRequestedDosage() { return requestedDosage; }
    public void setRequestedDosage(String requestedDosage) { this.requestedDosage = requestedDosage; }

    public PrescriptionRequestType getRequestType() { return requestType; }
    public void setRequestType(PrescriptionRequestType requestType) { this.requestType = requestType; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public PrescriptionRequestStatus getStatus() { return status; }
    public void setStatus(PrescriptionRequestStatus status) { this.status = status; }

    public String getAdminNote() { return adminNote; }
    public void setAdminNote(String adminNote) { this.adminNote = adminNote; }

    public LocalDateTime getRequestedAt() { return requestedAt; }

    public LocalDateTime getDecidedAt() { return decidedAt; }
    public void setDecidedAt(LocalDateTime decidedAt) { this.decidedAt = decidedAt; }

    public String getDecidedBy() { return decidedBy; }
    public void setDecidedBy(String decidedBy) { this.decidedBy = decidedBy; }
}