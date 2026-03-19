package com.consdev.mediportal.dto.medicalhistorydto;


import java.time.LocalDate;

public class ProcedureDto {
    private Long id;
    private String procedureName;
    private LocalDate procedureDate;
    private String hospital;
    private String notes;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProcedureName() { return procedureName; }
    public void setProcedureName(String procedureName) { this.procedureName = procedureName; }

    public LocalDate getProcedureDate() { return procedureDate; }
    public void setProcedureDate(LocalDate procedureDate) { this.procedureDate = procedureDate; }

    public String getHospital() { return hospital; }
    public void setHospital(String hospital) { this.hospital = hospital; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
