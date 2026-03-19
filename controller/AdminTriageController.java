package com.consdev.mediportal.controller;

import com.consdev.mediportal.dto.AssignAppointmentRequest;
import com.consdev.mediportal.dto.AdminTriageViewDto;
import com.consdev.mediportal.dto.CloseTriageRequest;
import com.consdev.mediportal.dto.TriageCallRequest;
import com.consdev.mediportal.entities.Appointment;
import com.consdev.mediportal.entities.CallLog;
import com.consdev.mediportal.entities.TriageRequest;
import com.consdev.mediportal.entities.User;
import com.consdev.mediportal.enums.CloseReason;
import com.consdev.mediportal.enums.TriageStatus;
import com.consdev.mediportal.repository.AppointmentRepository;
import com.consdev.mediportal.repository.TriageRequestRepository;
import com.consdev.mediportal.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/triage-requests")
public class AdminTriageController {

    private final TriageRequestRepository triageRepo;
    private final AppointmentRepository apptRepo;
    private final UserRepository userRep;

    private static final SecureRandom random = new SecureRandom();

    public AdminTriageController(TriageRequestRepository triageRepo, AppointmentRepository apptRepo, UserRepository userRep) {
        this.triageRepo = triageRepo;
        this.apptRepo = apptRepo;
        this.userRep = userRep;
    }

    private boolean isAdmin(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) return false;
        for (GrantedAuthority a : auth.getAuthorities()) {
            if (!"ROLE_PATIENT".equals(a.getAuthority())) return true;
        }
        return false;
    }

    @GetMapping
    public ResponseEntity<?> list(@RequestParam(required = false) TriageStatus status, Authentication auth) {
        if (!isAdmin(auth)) return ResponseEntity.status(403).body("Forbidden");

        var triageList = (status != null)
                ? triageRepo.findByStatusOrderByCreatedAtDesc(status)
                : triageRepo.findAllByOrderByCreatedAtDesc();

        var dtoList = triageList.stream()
                .map(this::toViewDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }


    @GetMapping("/{triageId}")
    public ResponseEntity<?> getOne(@PathVariable String triageId, Authentication auth) {
        if (!isAdmin(auth)) return ResponseEntity.status(403).body("Forbidden");

        var tr = triageRepo.findByTriageId(triageId).orElse(null);
        if (tr == null) return ResponseEntity.status(404).body("Not found");

        return ResponseEntity.ok(toViewDto(tr));
    }


    // ✅ 1) Log call attempt
//    @PostMapping("/{triageId}/call")
//    public ResponseEntity<?> logCall(
//            @PathVariable String triageId,
//            @RequestBody(required = false) TriageCallRequest body,
//            Authentication auth
//    ) {
//        if (!isAdmin(auth)) return ResponseEntity.status(403).body("Forbidden");
//
//        TriageRequest tr = triageRepo.findByTriageId(triageId).orElse(null);
//        if (tr == null) return ResponseEntity.status(404).body("Not found");
//
//        int attempts = tr.getCallAttempts() == null ? 0 : tr.getCallAttempts();
//        tr.setCallAttempts(attempts + 1);
//        tr.setLastCalledAt(LocalDateTime.now());
//        tr.setCallNote(body != null ? body.getNote() : null);
//        tr.setStatus(TriageStatus.CALL_ATTEMPTED);
//
//        return ResponseEntity.ok(triageRepo.save(tr));
//    }

    // ✅ 2) Assign appointment
    @PostMapping("/{triageId}/assign-appointment")
    public ResponseEntity<?> assignAppointment(
            @PathVariable String triageId,
            @RequestBody AssignAppointmentRequest req,
            Authentication auth
    ) {
        if (!isAdmin(auth)) return ResponseEntity.status(403).body("Forbidden");

        if (req.getDateTime() == null || req.getDateTime().isBlank()) {
            return ResponseEntity.badRequest().body("dateTime is required");
        }
        if (req.getType() == null || req.getType().isBlank()) {
            return ResponseEntity.badRequest().body("type is required");
        }

        TriageRequest tr = triageRepo.findByTriageId(triageId).orElse(null);
        if (tr == null) return ResponseEntity.status(404).body("Not found");

        LocalDateTime dt;
        try {
            dt = LocalDateTime.parse(req.getDateTime().trim());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid dateTime format (use ISO e.g. 2026-02-12T14:30)");
        }

        String apptId = "apt-" + String.format("%06d", random.nextInt(1000000));

        Appointment appt = new Appointment();
        appt.setAppointmentId(apptId);
        appt.setUserId(tr.getUserId());
        appt.setDateTime(dt);
        appt.setType(req.getType().trim().toUpperCase());
        appt.setNote(req.getNote());
        appt.setCreatedAt(LocalDateTime.now());

        apptRepo.save(appt);

        tr.setAssignedAppointmentId(apptId);
        tr.setDecisionReason(null);
        tr.setDecisionNote(req.getNote());
        tr.setDecidedBy(auth.getName());
        tr.setDecidedAt(LocalDateTime.now());
        tr.setStatus(TriageStatus.APPOINTMENT_ASSIGNED);

        triageRepo.save(tr);

        return ResponseEntity.ok(Map.of(
                "triage", tr,
                "appointment", appt
        ));
    }

    // ✅ 3) Close without appointment (reason REQUIRED)
//    @PostMapping("/{triageId}/close")
//    public ResponseEntity<?> closeNoAppointment(
//            @PathVariable String triageId,
//            @RequestBody CloseTriageRequest req,
//            Authentication auth
//    ) {
//        if (!isAdmin(auth)) return ResponseEntity.status(403).body("Forbidden");
//
//        if (req.getReason() == null || req.getReason().isBlank()) {
//            return ResponseEntity.badRequest().body("reason is required");
//        }
//
//        TriageRequest tr = triageRepo.findByTriageId(triageId).orElse(null);
//        if (tr == null) return ResponseEntity.status(404).body("Not found");
//
//        tr.setDecisionReason(req.getReason().trim());
//        tr.setDecisionNote(req.getNote());
//        tr.setDecidedBy(auth.getName());
//        tr.setDecidedAt(LocalDateTime.now());
//        tr.setStatus(TriageStatus.CLOSED_NO_APPOINTMENT);
//
//        return ResponseEntity.ok(triageRepo.save(tr));
//    }

    private AdminTriageViewDto toViewDto(TriageRequest tr) {
        User u = userRep.findById(tr.getUserId()).orElse(null);

        AdminTriageViewDto.PatientDTO p = new AdminTriageViewDto.PatientDTO(
                u != null ? u.getId() : tr.getUserId(),
                u != null ? u.getFirstName() : null,
                u != null ? u.getLastName() : null,
                u != null ? u.getEmail() : null,
                u != null ? u.getPhoneNumber() : null,
                u != null && u.getDateOfBirth() != null ? u.getDateOfBirth().toString() : null
        );

        return new AdminTriageViewDto(p, tr);
    }
    @PostMapping("/{triageId}/call")
    public ResponseEntity<?> logCall(
            @PathVariable String triageId,
            @RequestBody com.consdev.mediportal.dto.AdminCallLogRequest body,
            Authentication auth
    ) {
        if (!isAdmin(auth)) return ResponseEntity.status(403).body("Forbidden");

        var tr = triageRepo.findByTriageId(triageId).orElse(null);
        if (tr == null) return ResponseEntity.status(404).body("Not found");

        String note = body.getNote();
        if (note == null || note.isBlank()) {
            return ResponseEntity.badRequest().body("note is required");
        }

        tr.getCallLogs().add(new CallLog(LocalDateTime.now(), note.trim()));
        tr.setCallAttempts((tr.getCallAttempts() == null ? 0 : tr.getCallAttempts()) + 1);
        tr.setLastCalledAt(LocalDateTime.now());
        tr.setCallNote(note.trim());

        tr.setStatus(TriageStatus.CALL_ATTEMPTED);

        return ResponseEntity.ok(triageRepo.save(tr));
    }

//    @PostMapping("/{triageId}/close")
//    public ResponseEntity<?> close(
//            @PathVariable String triageId,
//            @RequestBody com.consdev.mediportal.dto.AdminCloseTriageRequest body,
//            Authentication auth
//    ) {
//        if (!isAdmin(auth)) return ResponseEntity.status(403).body("Forbidden");
//
//        var tr = triageRepo.findByTriageId(triageId).orElse(null);
//        if (tr == null) return ResponseEntity.status(404).body("Not found");
//
//        if (body.getReason() == null) {
//            return ResponseEntity.badRequest().body("reason is required");
//        }
//
//        if (body.getReason().name().equals("OTHER")) {
//            if (body.getNote() == null || body.getNote().isBlank()) {
//                return ResponseEntity.badRequest().body("note is required when reason is OTHER");
//            }
//        }
//
//        tr.setCloseReason(body.getReason());
//        tr.setCloseNote(body.getNote());
//        tr.setClosedAt(LocalDateTime.now());
//        tr.setStatus(TriageStatus.CLOSED_NO_APPOINTMENT);
//
//        return ResponseEntity.ok(triageRepo.save(tr));
//    }

    @PostMapping("/{triageId}/close")
    public ResponseEntity<?> close(
            @PathVariable String triageId,
            @RequestBody CloseTriageRequest req,
            Authentication auth
    ) {
        if (!isAdmin(auth)) return ResponseEntity.status(403).body("Forbidden");

        if (req == null || req.getReason() == null || req.getReason().isBlank()) {
            return ResponseEntity.badRequest().body("Reason is required");
        }

        // Convert reason safely (handles lowercase from frontend)
        CloseReason closeReason;
        try {
            closeReason = CloseReason.valueOf(req.getReason().trim().toUpperCase());
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Invalid reason: " + req.getReason());
        }

        String note = req.getNote() == null ? "" : req.getNote().trim();

        if (closeReason == CloseReason.OTHER && note.isBlank()) {
            return ResponseEntity.badRequest().body("Note is required when reason is OTHER");
        }

        // Your entity @Id is triageId, so this is fine:
        TriageRequest tr = triageRepo.findById(triageId).orElse(null);

        // If you prefer your other style, you can use:
        // TriageRequest tr = triageRepo.findByTriageId(triageId).orElse(null);

        if (tr == null) {
            return ResponseEntity.status(404).body("Triage request not found: " + triageId);
        }

        tr.setStatus(TriageStatus.CLOSED_NO_APPOINTMENT);
        tr.setCloseReason(closeReason);
        tr.setCloseNote(note);

        tr.setDecisionReason(closeReason.name());
        tr.setDecisionNote(note);

        tr.setDecidedBy(auth.getName());
        tr.setDecidedAt(LocalDateTime.now());
        tr.setClosedAt(LocalDateTime.now());

        return ResponseEntity.ok(triageRepo.save(tr));
    }

}








