package com.consdev.mediportal.dto.medicalhistorydto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateAllergyRequest {

    @NotBlank
    @Size(max = 120)
    private String allergen;

    @NotNull
    private String severity;

    @Size(max = 255)
    private String reaction;

    @Size(max = 500)
    private String notes;

    public String getAllergen() { return allergen; }
    public void setAllergen(String allergen) { this.allergen = allergen; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getReaction() { return reaction; }
    public void setReaction(String reaction) { this.reaction = reaction; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}