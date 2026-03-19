package com.consdev.mediportal.dto;

import java.util.List;

public class ChatMessageResponse {
    public String assistantMessage;
    public String triageCategory; // MINOR, ROUTINE_GP, URGENT_SAME_DAY, EMERGENCY
    public List<String> advice;   // shown only when minor
    public boolean askHelpful;    // if we want "does this help?"
    public boolean offerBookConsultation;
    public List<String> quickReplies;
}

