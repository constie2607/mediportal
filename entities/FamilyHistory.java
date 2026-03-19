package com.consdev.mediportal.entities;

import com.consdev.mediportal.enums.FamilyRelative;
import com.consdev.mediportal.entities.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "family_history")
public class FamilyHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many family history rows belong to one patient
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnore
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private FamilyRelative relative;

    @Column(name = "condition_name", nullable = false, length = 200)
    private String conditionName;

    @Column(name = "age_of_onset")
    private Short ageOfOnset;

    @Column(length = 700)
    private String notes;

    @CreationTimestamp
    @Column(name = "recorded_at", nullable = false, updatable = false)
    private LocalDateTime recordedAt;

    // getters/setters
    public Long getId() { return id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public FamilyRelative getRelative() { return relative; }
    public void setRelative(FamilyRelative relative) { this.relative = relative; }

    public String getConditionName() { return conditionName; }
    public void setConditionName(String conditionName) { this.conditionName = conditionName; }

    public Short getAgeOfOnset() { return ageOfOnset; }
    public void setAgeOfOnset(Short ageOfOnset) { this.ageOfOnset = ageOfOnset; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
}