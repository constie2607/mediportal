package com.consdev.mediportal.entities;

import com.consdev.mediportal.enums.ConditionStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "medical_condition")
public class MedicalCondition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many conditions belong to one patient
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(name = "diagnosed_date")
    private LocalDate diagnosedDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private ConditionStatus status = ConditionStatus.ACTIVE;

    @Column(length = 700)
    private String notes;

    @CreationTimestamp
    @Column(name = "recorded_at", nullable = false, updatable = false)
    private LocalDateTime recordedAt;

    // getters/setters
    public Long getId() { return id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public LocalDate getDiagnosedDate() { return diagnosedDate; }
    public void setDiagnosedDate(LocalDate diagnosedDate) { this.diagnosedDate = diagnosedDate; }

    public ConditionStatus getStatus() { return status; }
    public void setStatus(ConditionStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
}