package com.consdev.mediportal.dto;

import java.util.List;
import java.util.Map;

public class SymptomCheckRequestDto {

    private String problem;
    private String duration;

    private Integer severity;
    private Integer durationDays;

    private List<String> symptoms;           // ✅ structured
    private Map<String, Boolean> redFlags;   // ✅ already using

    public String getProblem() { return problem; }
    public void setProblem(String problem) { this.problem = problem; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public Integer getSeverity() { return severity; }
    public void setSeverity(Integer severity) { this.severity = severity; }

    public Integer getDurationDays() { return durationDays; }
    public void setDurationDays(Integer durationDays) { this.durationDays = durationDays; }

    public List<String> getSymptoms() { return symptoms; }
    public void setSymptoms(List<String> symptoms) { this.symptoms = symptoms; }

    public Map<String, Boolean> getRedFlags() { return redFlags; }
    public void setRedFlags(Map<String, Boolean> redFlags) { this.redFlags = redFlags; }
}