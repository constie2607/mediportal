package com.consdev.mediportal.entities;

import com.consdev.mediportal.enums.TriageStatus;
import com.consdev.mediportal.enums.UrgencyLevel;
import com.consdev.mediportal.enums.CloseReason;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
    @Entity
    public class TriageRequest {
        @Id
        private String triageId; // e.g. "trg-12345"

        @Column(nullable = false)
        private String userId;
        @Column(length = 500, nullable = false)
        private String problem;
        @Column(length = 500, nullable = false)
        private String duration;
        @Column(length = 500)
        private String tried;
        @Column(length = 500)
        private String worried;
        @Column(length = 500)
        private String helpWanted;
        @Column(length = 500)
        private String bestTimes;
        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        private TriageStatus status;
        @CreationTimestamp
        @Column(updatable = false)
        private LocalDateTime createdAt;
        @ElementCollection
        @CollectionTable(name = "triage_symptoms", joinColumns = @JoinColumn(name = "triage_id"))
        @Column(name = "symptom")
        private List<String> symptoms;
        @Enumerated(EnumType.STRING)
        private UrgencyLevel aiUrgencyLevel;
        @Column(length = 1000)
        private String aiRecommendedAction;
        @Lob
        private String aiSelfCareAdvice;
        @Lob
        private String aiSafetyNet;
        @Lob
        private String aiRedFlagsTriggered;
        @Lob
        private  String aiClinicianSummary;
        private LocalDateTime aiGeneratedAt;

        //admin workflow
        private Integer callAttempts;
        private LocalDateTime lastCalledAt;

        @Column(length = 800)
        private String callNote;

        private String assignedAppointmentId; // nullable

        @Column(length = 800)
        private String decisionReason; // required when closed w/out appt

        @Column(length = 800)
        private String decisionNote;   // optional

        private String decidedBy;      // admin id/email principal
        private LocalDateTime decidedAt;

        @ElementCollection
        @CollectionTable(name = "triage_call_logs", joinColumns = @JoinColumn(name = "triage_id"))
        private List<CallLog> callLogs = new ArrayList<>();

        @Enumerated(EnumType.STRING)
        private CloseReason closeReason;

        @Column(length = 800)
        private String closeNote;

        private LocalDateTime closedAt;

        @Column(length = 2000)
        private String aiKeywordsMatched; // optional JSON string

        @Column
        private Integer aiRiskScore;

        @Column(length = 1000)
        private String aiPathwaysMatched;

        @Column(length = 2000)
        private String aiStructuredSymptomsMatched;




        //getters&setters
        public String getTriageId() {return triageId;}
        public void setTriageId(String triageId) {this.triageId = triageId;}

        public String getUserId() {return userId;}
        public void setUserId(String userId) {this.userId = userId;}

        public String getProblem() {return problem;}
        public void setProblem(String problem) {this.problem = problem;}

        public String getDuration() {return duration;}
        public void setDuration(String duration) {this.duration = duration;}

        public String getTried() {return tried;}
        public void setTried(String tried) {this.tried = tried;}

        public String getWorried() {return worried;}
        public void setWorried(String worried) {this.worried = worried;}

        public String getHelpWanted() {return helpWanted;}
        public void setHelpWanted(String helpWanted) {this.helpWanted = helpWanted;}

        public String getBestTimes() {return bestTimes;}
        public void setBestTimes(String bestTimes) {this.bestTimes = bestTimes;}

        public TriageStatus getStatus() {return status;}
        public void setStatus(TriageStatus status) {this.status = status;}

        public LocalDateTime getCreatedAt() {return createdAt;}
        public void setCreatedAt(LocalDateTime createdAt) {this.createdAt = createdAt;}

        public List<String> getSymptoms() {return symptoms;}
        public void setSymptoms(List<String> symptoms) {this.symptoms = symptoms;}

        public UrgencyLevel getAiUrgencyLevel() {return aiUrgencyLevel;}
        public void setAiUrgencyLevel(UrgencyLevel aiUrgencyLevel){this.aiUrgencyLevel=aiUrgencyLevel;}

        public String getAiRecommendedAction() {return aiRecommendedAction;}
        public void setAiRecommendedAction(String aiRecommendedAction) {this.aiRecommendedAction = aiRecommendedAction;}

        public String getAiSelfCareAdvice() {return aiSelfCareAdvice;}
        public void setAiSelfCareAdvice(String aiSelfCareAdvice) {this.aiSelfCareAdvice = aiSelfCareAdvice;}

        public String getAiSafetyNet() {return aiSafetyNet;}
        public void setAiSafetyNet(String aiSafetyNet) {this.aiSafetyNet = aiSafetyNet;}

        public String getAiRedFlagsTriggered() {return aiRedFlagsTriggered;}
        public void setAiRedFlagsTriggered(String aiRedFlagsTriggered) {this.aiRedFlagsTriggered = aiRedFlagsTriggered;}

        public String getAiClinicianSummary() {return aiClinicianSummary;}
        public void setAiClinicianSummary(String aiClinicianSummary) {this.aiClinicianSummary = aiClinicianSummary;}

        public LocalDateTime getAiGeneratedAt() {return aiGeneratedAt;}
        public void setAiGeneratedAt(LocalDateTime aiGeneratedAt) {this.aiGeneratedAt = aiGeneratedAt;}

        public Integer getCallAttempts() { return callAttempts; }
        public void setCallAttempts(Integer callAttempts) { this.callAttempts = callAttempts; }

        public LocalDateTime getLastCalledAt() { return lastCalledAt; }
        public void setLastCalledAt(LocalDateTime lastCalledAt) { this.lastCalledAt = lastCalledAt; }

        public String getCallNote() { return callNote; }
        public void setCallNote(String callNote) { this.callNote = callNote; }

        public String getAssignedAppointmentId() { return assignedAppointmentId; }
        public void setAssignedAppointmentId(String assignedAppointmentId) { this.assignedAppointmentId = assignedAppointmentId; }

        public String getDecisionReason() { return decisionReason; }
        public void setDecisionReason(String decisionReason) { this.decisionReason = decisionReason; }

        public String getDecisionNote() { return decisionNote; }
        public void setDecisionNote(String decisionNote) { this.decisionNote = decisionNote; }

        public String getDecidedBy() { return decidedBy; }
        public void setDecidedBy(String decidedBy) { this.decidedBy = decidedBy; }

        public LocalDateTime getDecidedAt() { return decidedAt; }
        public void setDecidedAt(LocalDateTime decidedAt) { this.decidedAt = decidedAt; }

        public List<CallLog> getCallLogs() { return callLogs; }
        public void setCallLogs(List<CallLog> callLogs) { this.callLogs = callLogs; }

        public CloseReason getCloseReason() { return closeReason; }
        public void setCloseReason(CloseReason closeReason) { this.closeReason = closeReason; }

        public String getCloseNote() { return closeNote; }
        public void setCloseNote(String closeNote) { this.closeNote = closeNote; }

        public LocalDateTime getClosedAt() { return closedAt; }
        public void setClosedAt(LocalDateTime closedAt) { this.closedAt = closedAt; }

        public String getAiKeywordsMatched() { return aiKeywordsMatched; }
        public void setAiKeywordsMatched(String aiKeywordsMatched) { this.aiGeneratedAt = aiGeneratedAt; }

        public String getAiPathwaysMatched() { return aiPathwaysMatched; }
        public void setAiPathwaysMatched(String aiPathwaysMatched) { this.aiPathwaysMatched = aiPathwaysMatched; }

        public String getAiStructuredSymptomsMatched() { return aiStructuredSymptomsMatched; }
        public void setAiStructuredSymptomsMatched(String aiStructuredSymptomsMatched) { this.aiStructuredSymptomsMatched = aiStructuredSymptomsMatched; }

        public Integer getAiRiskScore() { return aiRiskScore; }
        public void setAiRiskScore(Integer aiRiskScore) { this.aiRiskScore = aiRiskScore; }







    }
