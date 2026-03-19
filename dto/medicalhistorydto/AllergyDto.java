package com.consdev.mediportal.dto.medicalhistorydto;


public class AllergyDto {
    private Long id;
    private String allergen;
    private String severity; // LOW/MEDIUM/HIGH
    private String reaction;
    private String notes;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAllergen() { return allergen; }
    public void setAllergen(String allergen) { this.allergen = allergen; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getReaction() { return reaction; }
    public void setReaction(String reaction) { this.reaction = reaction; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}