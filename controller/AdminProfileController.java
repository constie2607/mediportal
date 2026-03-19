package com.consdev.mediportal.controller;

import com.consdev.mediportal.dto.AdminProfileDto;
import com.consdev.mediportal.dto.UpdateAdminProfileRequest;
import com.consdev.mediportal.service.AdminProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminProfileController {

    private final AdminProfileService adminProfileService;

    @GetMapping("/profile")
    public AdminProfileDto getMyProfile(Authentication authentication) {
        return adminProfileService.getMyProfile(authentication);
    }

    @PutMapping("/profile")
    public AdminProfileDto updateMyProfile(
            Authentication authentication,
            @RequestBody UpdateAdminProfileRequest request
    ) {
        return adminProfileService.updateMyProfile(authentication, request);
    }
}