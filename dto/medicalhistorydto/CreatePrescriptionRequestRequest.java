package com.consdev.mediportal.dto.medicalhistorydto;

public class CreatePrescriptionRequestRequest {
    private String medicationName;
    private String requestedDosage;
    private String requestType;
    private String reason;

    public String getMedicationName() { return medicationName; }
    public void setMedicationName(String medicationName) { this.medicationName = medicationName; }

    public String getRequestedDosage() { return requestedDosage; }
    public void setRequestedDosage(String requestedDosage) { this.requestedDosage = requestedDosage; }

    public String getRequestType() { return requestType; }
    public void setRequestType(String requestType) { this.requestType = requestType; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}