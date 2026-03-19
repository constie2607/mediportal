package com.consdev.mediportal.dto;

import com.consdev.mediportal.enums.CloseReason;

public class AdminCloseTriageRequest {
    private CloseReason reason;
    private String note;

    public CloseReason getReason() { return reason; }
    public void setReason(CloseReason reason) { this.reason = reason; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
