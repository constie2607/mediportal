package com.consdev.mediportal.dto.medicalhistorydto;
import java.time.LocalDateTime;

public class TimelineItemDto {

    public enum Type { TRIAGE, APPOINTMENT, PRESCRIPTION, NOTE }

    private Type type;
    private LocalDateTime dateTime;
    private String title;
    private String status;

    private String refId; // ✅ String now (triageId like "trg-12345")

    private String clinicianName;

    public Type getType() { return type; }
    public void setType(Type type) { this.type = type; }

    public LocalDateTime getDateTime() { return dateTime; }
    public void setDateTime(LocalDateTime dateTime) { this.dateTime = dateTime; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRefId() { return refId; }
    public void setRefId(String refId) { this.refId = refId; }

    public String getClinicianName() { return clinicianName; }
    public void setClinicianName(String clinicianName) { this.clinicianName = clinicianName; }
}
