package com.consdev.mediportal.controller;

import com.consdev.mediportal.dto.*;
//import com.consdev.mediportal.dto.StaffActivateRequest;
//import com.consdev.mediportal.dto.StaffActivateRequest;
import com.consdev.mediportal.entities.User;
import com.consdev.mediportal.repository.UserRepository;
import com.consdev.mediportal.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(
        origins = "http://localhost:4200",
        allowCredentials = "true"
)
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthService authService, UserRepository userRepository, PasswordEncoder passwordEncoder)
    {
        this.authService = authService;
        this.passwordEncoder=passwordEncoder;
        this.userRepository=userRepository;
    }


    /* ================= LOGIN ================= */

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        UserDto user = authService.login(request.getEmail(), request.getPassword());

        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }

        // 🔐 Generate token or session id
        String token = authService.generateToken(user);

        ResponseCookie cookie = ResponseCookie.from("MP_AUTH", token)
                .httpOnly(true)
                .secure(false) // TRUE in production (HTTPS)
                .sameSite("Lax")
                .path("/")
                .maxAge(60 * 60) // 1 hour
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(user);
    }

    /* ================= WHO AM I ================= */

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest request) {

        UserDto user = authService.getUserFromRequest(request);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(user);
    }

    @PostMapping("/activate")
    public ResponseEntity<?> activateStaff(@RequestBody ActivateAccountRequest req) {

        if(req.getId()==null || req.getId().isBlank())
        {
            return ResponseEntity.badRequest().body("patient ID is required");
        }
        if (req.getDateOfBirth() == null || req.getDateOfBirth().isBlank()) {
            return ResponseEntity.badRequest().body("Date of birth is required");
        }
        if(req.getPassword()==null || req.getPassword().length()<8)
        {
            return ResponseEntity.badRequest().body("Password must be atleast 8 characters");
        }
        User user = userRepository.findById(req.getId()).orElse(null);

        if(user==null)
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid details");
        }
        if(Boolean.TRUE.equals(user.isEnabled()))
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Account already activated. Please log in.");
        }
        if(user.getPassword()!=null && !user.getPassword().isBlank())
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Account already has a password. Please log in");
        }

        LocalDate dob;
        try {
            dob = LocalDate.parse(req.getDateOfBirth()); // expects yyyy-mm-dd
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Date of birth format must be yyyy-mm-dd");
        }

        if (user.getDateOfBirth() == null || !user.getDateOfBirth().equals(dob)) {
            return ResponseEntity.badRequest().body("Invalid details");
        }
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setEnabled(true);

        userRepository.save(user);
        return ResponseEntity.ok(new ApiResponse("Account activated successfully. You can now log in."));
    }

    /* ================= LOGOUT ================= */

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {

        ResponseCookie cookie = ResponseCookie.from("MP_AUTH", "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok().build();
    }
}
