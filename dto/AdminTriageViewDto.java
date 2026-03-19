package com.consdev.mediportal.dto;

import com.consdev.mediportal.entities.TriageRequest;

public class AdminTriageViewDto {

    private PatientDTO patient;
    private TriageRequest triage;

    public AdminTriageViewDto(PatientDTO patient, TriageRequest triage) {
        this.patient = patient;
        this.triage = triage;
    }

    public PatientDTO getPatient() { return patient; }
    public void setPatient(PatientDTO patient) { this.patient = patient; }

    public TriageRequest getTriage() { return triage; }
    public void setTriage(TriageRequest triage) { this.triage = triage; }

    // nested patient dto (only fields you want admin to see)
    public static class PatientDTO {
        private String id;
        private String firstName;
        private String lastName;
        private String email;
        private String phoneNumber;
        private String dateOfBirth;

        public PatientDTO() {}

        public PatientDTO(String id, String firstName, String lastName, String email, String phoneNumber, String dateOfBirth) {
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.phoneNumber = phoneNumber;
            this.dateOfBirth = dateOfBirth;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }

        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

        public String getDateOfBirth() { return dateOfBirth; }
        public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    }
}
