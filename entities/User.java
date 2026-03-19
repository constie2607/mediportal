package com.consdev.mediportal.entities;

import com.consdev.mediportal.dto.UserDto;
import com.consdev.mediportal.enums.UserRole;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class User {
    @Id
    @Column(length = 36, nullable = false, updatable = false)
    private String id;

    private String email;

    private String password;

    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String phoneNumber;
    private String emergencyContactName;
    private String emergencyContactPhone;

    private UserRole role;

    private String inviteToken;
    private LocalDateTime inviteExpiry;
    private boolean enabled;


    //getters & setters
    public String getInviteToken() {return inviteToken;}
    public void setInviteToken(String inviteToken) {this.inviteToken = inviteToken;}

    public LocalDateTime getInviteExpiry() {return inviteExpiry;}
    public void setInviteExpiry(LocalDateTime inviteExpiry) {this.inviteExpiry = inviteExpiry;}

    public boolean isEnabled() {return enabled;}
    public void setEnabled(boolean enabled) {this.enabled = enabled;}

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }
    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }
    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public UserRole getRole() {
        return role;
    }
    public void setRole(UserRole role) {
        this.role = role;
    }

    public String getEmergencyContactName() { return emergencyContactName; }
    public void setEmergencyContactName(String emergencyContactName) { this.emergencyContactName = emergencyContactName; }

    public String getEmergencyContactPhone() { return emergencyContactPhone; }
    public void setEmergencyContactPhone(String emergencyContactPhone) { this.emergencyContactPhone = emergencyContactPhone; }


    public UserDto getDto()
    {
        UserDto dto = new UserDto();

        dto.setId(id);
        dto.setEmail(email);
        dto.setFirstName(firstName);
        dto.setLastName(lastName);
        dto.setDateOfBirth(dateOfBirth);
        dto.setGender(gender);
        dto.setAddress(address);
        dto.setPhoneNumber(phoneNumber);
        dto.setRole(role);
        dto.setEnabled(enabled);

        return dto;
    }
}
