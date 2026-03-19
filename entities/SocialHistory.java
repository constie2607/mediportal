package com.consdev.mediportal.entities;

import com.consdev.mediportal.enums.AlcoholUse;
import com.consdev.mediportal.enums.ExerciseLevel;
import com.consdev.mediportal.enums.SmokingStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "social_history")
public class SocialHistory {

    @Id
    @Column(name = "patient_id")
    private String patientId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnore
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "smoking_status")
    private SmokingStatus smokingStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "alcohol_use")
    private AlcoholUse alcoholUse;

    @Enumerated(EnumType.STRING)
    @Column(name = "exercise_level")
    private ExerciseLevel exerciseLevel;

    @Column(length = 160)
    private String occupation;

    @Column(length = 700)
    private String notes;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public SmokingStatus getSmokingStatus() {
        return smokingStatus;
    }

    public void setSmokingStatus(SmokingStatus smokingStatus) {
        this.smokingStatus = smokingStatus;
    }

    public AlcoholUse getAlcoholUse() {
        return alcoholUse;
    }

    public void setAlcoholUse(AlcoholUse alcoholUse) {
        this.alcoholUse = alcoholUse;
    }

    public ExerciseLevel getExerciseLevel() {
        return exerciseLevel;
    }

    public void setExerciseLevel(ExerciseLevel exerciseLevel) {
        this.exerciseLevel = exerciseLevel;
    }

    public String getOccupation() {
        return occupation;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}