package com.consdev.mediportal.dto;

import com.consdev.mediportal.enums.CloseReason;

import java.util.List;

public class BulkScheduleRequest {
    private String doctorId;
    private String type;     // "AVAILABLE" or "TIME_OFF"
    private String startTime; // "09:00" (required if AVAILABLE)
    private String endTime;   // "17:00" (required if AVAILABLE)
    private String note;
    private List<String> dates; // ["2026-02-16","2026-02-17",...]

    // getters/setters

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public List <String> getDates() { return dates; }
    public void setDates(List <String> dates) { this.dates = dates; }
}
