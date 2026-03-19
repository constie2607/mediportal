package com.consdev.mediportal.controller;

import com.consdev.mediportal.dto.*;
import com.consdev.mediportal.entities.User;
import com.consdev.mediportal.enums.UserRole;
import com.consdev.mediportal.service.AuthService;
import com.consdev.mediportal.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final AuthService authService;
    private final UserRepository userRepository;

    public AdminController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }


    // Register staff
    @PostMapping("/staff")
    public ResponseEntity<?> createStaff(@RequestBody StaffCreateRequest req) {
        System.out.println("REQ DOB = " + req.getDateOfBirth());
        System.out.println("REQ ROLE = " + req.getRole());
        User user = authService.createStaffInvite(req);
        return ResponseEntity.ok(user.getDto());
    }

    // ✅ List staff (non-patients)
    @GetMapping("/staff")
    public ResponseEntity<?> listStaff() {
        return ResponseEntity.ok(authService.listStaff());
    }

    // ✅ Update staff
    @PutMapping("/staff/{id}")
    public ResponseEntity<?> updateStaff(@PathVariable String id, @RequestBody StaffUpdateRequest req)
    {
        UserDto dto = authService.updateStaff(id,req);
        if (dto==null)
        {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/staff/{id}")
    public ResponseEntity<?> deleteStaff(@PathVariable String id) {
        try {
            authService.deleteStaff(id);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    //patients
    @PostMapping("/patients")
    public ResponseEntity<?> createPatient(@RequestBody PatientCreateRequest req) {
        try {
            User patient = authService.createPatient(req);
            return ResponseEntity.ok(patient.getDto());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/patients")
    public ResponseEntity<?> listPatients() {
        return ResponseEntity.ok(authService.listPatients());
    }

    @GetMapping("/patients/find")
    public ResponseEntity <?> findPatient (@RequestParam String email, @RequestParam LocalDate dateOfBirth)
    {
        UserDto dto = authService.findPatientByEmailAndDob(email, dateOfBirth);
        if (dto == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Patient not Found");
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/patients/{id}")
    public ResponseEntity <?> updatePatient(@PathVariable String id, @RequestBody PatientUpdateRequest req)
    {
        UserDto dto = authService.updatePatient(id, req);
                return ResponseEntity.ok(dto);
    }



}