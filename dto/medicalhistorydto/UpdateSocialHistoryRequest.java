package com.consdev.mediportal.dto.medicalhistorydto;

public class UpdateSocialHistoryRequest {
    private String smokingStatus;
    private String alcoholUse;
    private String exerciseLevel;
    private String occupation;
    private String notes;

    public String getSmokingStatus() { return smokingStatus; }
    public void setSmokingStatus(String smokingStatus) { this.smokingStatus = smokingStatus; }

    public String getAlcoholUse() { return alcoholUse; }
    public void setAlcoholUse(String alcoholUse) { this.alcoholUse = alcoholUse; }

    public String getExerciseLevel() { return exerciseLevel; }
    public void setExerciseLevel(String exerciseLevel) { this.exerciseLevel = exerciseLevel; }

    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}