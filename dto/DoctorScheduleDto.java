package com.consdev.mediportal.dto;

import com.consdev.mediportal.enums.ScheduleType;

public class DoctorScheduleDto {
    public String doctorId;
    public String date;      // YYYY-MM-DD
    public ScheduleType type;
    public String startTime; // HH:mm
    public String endTime;   // HH:mm
    public String note;

    public DoctorScheduleDto(String doctorId, String date, ScheduleType type, String startTime, String endTime, String note) {
        this.doctorId = doctorId;
        this.date = date;
        this.type = type;
        this.startTime = startTime;
        this.endTime = endTime;
        this.note = note;
    }
}