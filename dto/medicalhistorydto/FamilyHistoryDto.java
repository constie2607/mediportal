package com.consdev.mediportal.dto.medicalhistorydto;

public class FamilyHistoryDto {
    private Long id;
    private String relative;     // MOTHER/FATHER/...
    private String conditionName;
    private Short ageOfOnset;
    private String notes;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRelative() { return relative; }
    public void setRelative(String relative) { this.relative = relative; }

    public String getConditionName() { return conditionName; }
    public void setConditionName(String conditionName) { this.conditionName = conditionName; }

    public Short getAgeOfOnset() { return ageOfOnset; }
    public void setAgeOfOnset(Short ageOfOnset) { this.ageOfOnset = ageOfOnset; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
