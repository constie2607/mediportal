package com.consdev.mediportal.entities;

import com.consdev.mediportal.enums.MedicationRoute;
import com.consdev.mediportal.enums.MedicationStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "medication")
public class Medication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(name = "medication_name", nullable = false, length = 160)
    private String medicationName;

    @Column(length = 100)
    private String dosage;

    @Column(length = 100)
    private String frequency;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private MedicationRoute route;

    private LocalDate startDate;
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MedicationStatus status = MedicationStatus.ACTIVE;

    @Column(length = 255)
    private String indication;

    @Column(length = 500)
    private String instructions;

    @Column(length = 120)
    private String prescribedBy;

    @Column(length = 700)
    private String notes;

    @CreationTimestamp
    @Column(name = "recorded_at", nullable = false, updatable = false)
    private LocalDateTime recordedAt;

    public Long getId() { return id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getMedicationName() { return medicationName; }
    public void setMedicationName(String medicationName) { this.medicationName = medicationName; }

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public MedicationRoute getRoute() { return route; }
    public void setRoute(MedicationRoute route) { this.route = route; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public MedicationStatus getStatus() { return status; }
    public void setStatus(MedicationStatus status) { this.status = status; }

    public String getIndication() { return indication; }
    public void setIndication(String indication) { this.indication = indication; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public String getPrescribedBy() { return prescribedBy; }
    public void setPrescribedBy(String prescribedBy) { this.prescribedBy = prescribedBy; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
}