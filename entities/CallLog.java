package com.consdev.mediportal.entities;

import jakarta.persistence.Embeddable;
import java.time.LocalDateTime;

@Embeddable
public class CallLog {
    private LocalDateTime calledAt;
    private String note;

    public CallLog() {}

    public CallLog(LocalDateTime calledAt, String note) {
        this.calledAt = calledAt;
        this.note = note;
    }

    public LocalDateTime getCalledAt() { return calledAt; }
    public void setCalledAt(LocalDateTime calledAt) { this.calledAt = calledAt; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
