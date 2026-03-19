package com.consdev.mediportal.controller;

import com.consdev.mediportal.dto.PatientProfileDto;
import com.consdev.mediportal.dto.UpdatePatientProfileRequest;
import com.consdev.mediportal.service.PatientProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patient")
@RequiredArgsConstructor
public class PatientProfileController {

    private final PatientProfileService patientProfileService;

    @GetMapping("/profile")
    public PatientProfileDto getMyProfile(Authentication authentication) {
        return patientProfileService.getMyProfile(authentication);
    }

    @PutMapping("/profile")
    public PatientProfileDto updateMyProfile(
            Authentication authentication,
            @RequestBody UpdatePatientProfileRequest request
    ) {
        return patientProfileService.updateMyProfile(authentication, request);
    }
}