package com.consdev.mediportal.dto;

import java.time.LocalDate;

public class ActivateAccountRequest {
    private String id;
    private String password;
    private String dateOfBirth;

    public String getId(){return id;}
    public void setId(String id){this.id=id;}

    public String getPassword(){return password;}
    public void setPassword(String password){this.password=password;}

    public String getDateOfBirth(){return dateOfBirth;}
    public void setDateOfBirth(String dateOfBirth){this.dateOfBirth=dateOfBirth;}
}
