package com.consdev.mediportal.config;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("authz")
public class Authz {

      public boolean canViewMedicalHistory(String userId, Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) return false;

        boolean isStaff = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")
                        || a.getAuthority().equals("ROLE_DOCTOR")
                        || a.getAuthority().equals("ROLE_SUPERADMIN"));

        if (isStaff) return true;

        return auth.getName().equals(userId);
    }
}