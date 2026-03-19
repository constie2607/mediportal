package com.consdev.mediportal.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
public class AiSymptomSession {

    @Id
    private String sessionId; // e.g. "ssc-uuid"

    @Column(nullable = false)
    private String userId;

    // Endless Medical session id
    @Column(nullable = false)
    private String endlessSessionId;

    // Store the chat log (simple JSON string)
    @Lob
    @Column(nullable = false)
    private String messagesJson;

    // Fields we’ll map into TriageRequest
    @Column(length = 500)
    private String problem;

    @Column(length = 500)
    private String duration;

    @Column(length = 500)
    private String tried;

    @Column(length = 500)
    private String worried;

    @Column(length = 500)
    private String helpWanted;

    @Column(length = 500)
    private String adviceGiven;

    // MINOR/ROUTINE_GP/URGENT_SAME_DAY/EMERGENCY
    @Column(length = 50)
    private String triageCategory;

    // null until asked “does this help?”
    private Boolean helpful;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    // getters/setters...
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getEndlessSessionId() { return endlessSessionId; }
    public void setEndlessSessionId(String endlessSessionId) { this.endlessSessionId = endlessSessionId; }

    public String getMessagesJson() { return messagesJson; }
    public void setMessagesJson(String messagesJson) { this.messagesJson = messagesJson; }

    public String getProblem() { return problem; }
    public void setProblem(String problem) { this.problem = problem; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getTried() { return tried; }
    public void setTried(String tried) { this.tried = tried; }

    public String getWorried() { return worried; }
    public void setWorried(String worried) { this.worried = worried; }

    public String getHelpWanted() { return helpWanted; }
    public void setHelpWanted(String helpWanted) { this.helpWanted = helpWanted; }

    public String getAdviceGiven() { return adviceGiven; }
    public void setAdviceGiven(String adviceGiven) { this.adviceGiven = adviceGiven; }

    public String getTriageCategory() { return triageCategory; }
    public void setTriageCategory(String triageCategory) { this.triageCategory = triageCategory; }

    public Boolean getHelpful() { return helpful; }
    public void setHelpful(Boolean helpful) { this.helpful = helpful; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
