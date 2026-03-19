package com.consdev.mediportal.controller;

import com.consdev.mediportal.dto.BulkScheduleRequest;
import com.consdev.mediportal.entities.DoctorSchedule;
import com.consdev.mediportal.enums.ScheduleType;
import com.consdev.mediportal.enums.UserRole;
import com.consdev.mediportal.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.consdev.mediportal.repository.DoctorScheduleRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/schedule")
public class AdminScheduleController {

    private final DoctorScheduleRepository repo;
    private final UserRepository userRepo;

    public AdminScheduleController(DoctorScheduleRepository repo, UserRepository userRepo) {
        this.repo = repo;
        this.userRepo=userRepo;
    }

    @GetMapping
    public ResponseEntity<?> week(@RequestParam String from, @RequestParam String to) {
        LocalDate f = LocalDate.parse(from);
        LocalDate t = LocalDate.parse(to);
        return ResponseEntity.ok(repo.findByDateBetween(f, t));
    }

    @PostMapping("/bulk")
    public ResponseEntity<?> bulk(@RequestBody BulkScheduleRequest req) {
        if (req.getDoctorId() == null || req.getDoctorId().isBlank()) {
            return ResponseEntity.badRequest().body("doctorId is required");
        }
        if (req.getType() == null || req.getType().isBlank()) {
            return ResponseEntity.badRequest().body("type is required");
        }
        if (req.getDates() == null || req.getDates().isEmpty()) {
            return ResponseEntity.badRequest().body("dates is required");
        }

        ScheduleType type;
        try {
            type = ScheduleType.valueOf(req.getType().trim());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid type: " + req.getType());
        }

        LocalTime start = null, end = null;
        if (type == ScheduleType.AVAILABLE) {
            if (req.getStartTime() == null || req.getEndTime() == null) {
                return ResponseEntity.badRequest().body("startTime and endTime required for AVAILABLE");
            }
            start = LocalTime.parse(req.getStartTime().trim());
            end = LocalTime.parse(req.getEndTime().trim());
            if (!end.isAfter(start)) {
                return ResponseEntity.badRequest().body("endTime must be after startTime");
            }
        }

        List<LocalDate> dates = req.getDates().stream().map(LocalDate::parse).toList();

        // Option A behaviour: overwrite any existing schedule for these dates for this doctor
        repo.deleteByDoctorIdAndDateIn(req.getDoctorId(), dates);

        List<DoctorSchedule> saved = new ArrayList<>();
        for (LocalDate d : dates) {
            DoctorSchedule s = new DoctorSchedule();
            s.setDoctorId(req.getDoctorId());
            s.setDate(d);
            s.setType(type);
            s.setStartTime(start);
            s.setEndTime(end);
            s.setNote(req.getNote());
            saved.add(repo.save(s));
        }

        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/doctors")
    public ResponseEntity<?> doctors(Authentication auth) {
//        if (!isAdmin(auth)) return ResponseEntity.status(403).body("Forbidden");

        // Example: if role is stored as string/enum on User
        var docs = userRepo.findByRole(UserRole.DOCTOR)
                .stream()
                .map(u -> Map.of("id", u.getId(), "name", (u.getFirstName() + " " + u.getLastName()).trim()))
                .toList();

        return ResponseEntity.ok(docs);
    }
}