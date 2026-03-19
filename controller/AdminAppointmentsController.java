package com.consdev.mediportal.controller;

import com.consdev.mediportal.entities.*;
import com.consdev.mediportal.enums.ScheduleType;
import com.consdev.mediportal.enums.TriageStatus;
import com.consdev.mediportal.enums.UserRole;
import com.consdev.mediportal.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.time.*;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/appointments")
public class AdminAppointmentsController {

    private final UserRepository userRepo;
    private final AppointmentRepository apptRepo;
    private final TriageRequestRepository triageRepo;
    private final DoctorScheduleRepository docRepo;
    private final MessageRepository messageRepo;

    private static final SecureRandom random = new SecureRandom();

    public AdminAppointmentsController(DoctorScheduleRepository docRepo, UserRepository userRepo, AppointmentRepository apptRepo, TriageRequestRepository triageRepo, MessageRepository messageRepo) {
        this.userRepo = userRepo;
        this.apptRepo = apptRepo;
        this.triageRepo = triageRepo;
        this.docRepo=docRepo;
        this.messageRepo=messageRepo;
    }

    private boolean isAdmin(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) return false;
        for (GrantedAuthority a : auth.getAuthorities()) {
            if (!"ROLE_PATIENT".equals(a.getAuthority())) return true;
        }
        return false;
    }

    // ✅ 1) List doctors
    @GetMapping("/doctors")
    public ResponseEntity<?> listDoctors(Authentication auth) {
        if (!isAdmin(auth)) return ResponseEntity.status(403).body("Forbidden");

        List<User> docs = userRepo.findByRole(UserRole.DOCTOR);

        var dto = docs.stream().map(u -> Map.of(
                "id", u.getId(),
                "name", ((u.getFirstName() == null ? "" : u.getFirstName()) + " " +
                        (u.getLastName() == null ? "" : u.getLastName())).trim(),
                "email", u.getEmail()
        )).collect(Collectors.toList());

        return ResponseEntity.ok(dto);
    }

    // ✅ 2) List appointments for a doctor in date range
    // URL: GET /api/admin/appointments?doctorId=...&from=YYYY-MM-DD&to=YYYY-MM-DD
    @GetMapping
    public ResponseEntity<?> listAppointments(
            @RequestParam String doctorId,
            @RequestParam String from,
            @RequestParam String to,
            Authentication auth
    ) {
        if (!isAdmin(auth)) return ResponseEntity.status(403).body("Forbidden");

        LocalDateTime fromDt = LocalDate.parse(from).atStartOfDay();
        LocalDateTime toDt = LocalDate.parse(to).plusDays(1).atStartOfDay(); // inclusive end day

        var list = apptRepo.findByDoctorIdAndDateTimeBetween(doctorId, fromDt, toDt);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/availability")
    public ResponseEntity<?> availability(
            @RequestParam String doctorId,
            @RequestParam String from,   // yyyy-MM-dd
            @RequestParam String to,     // yyyy-MM-dd
            @RequestParam(defaultValue = "30") int slotMinutes,
            Authentication auth
    ) {
        if (!isAdmin(auth)) return ResponseEntity.status(403).body("Forbidden");
        if (doctorId == null || doctorId.isBlank()) return ResponseEntity.badRequest().body("doctorId is required");

        LocalDate fromDate;
        LocalDate toDate;
        try {
            fromDate = LocalDate.parse(from.trim());
            toDate = LocalDate.parse(to.trim());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("from/to must be yyyy-MM-dd");
        }

        if (toDate.isBefore(fromDate)) {
            return ResponseEntity.badRequest().body("to must be >= from");
        }

        // 1) Load schedules for this doctor in the range
        List<DoctorSchedule> schedules = docRepo.findByDoctorIdAndDateBetween(doctorId, fromDate, toDate);

        // Map by date for quick lookup (assume max 1 row per date per doctor)
        Map<LocalDate, DoctorSchedule> scheduleByDate = schedules.stream()
                .collect(Collectors.toMap(
                        DoctorSchedule::getDate,
                        s -> s,
                        (a, b) -> a // if duplicates exist, keep first (better: enforce unique in DB)
                ));

        // 2) Load booked appointments in the range
        LocalDateTime fromDT = fromDate.atStartOfDay();
        LocalDateTime toDT = toDate.plusDays(1).atStartOfDay(); // exclusive
        Set<LocalDateTime> booked = apptRepo.findByDoctorIdAndDateTimeBetween(doctorId, fromDT, toDT)
                .stream()
                .map(Appointment::getDateTime)
                .collect(Collectors.toSet());

        List<Map<String, Object>> slots = new ArrayList<>();

        for (LocalDate day = fromDate; !day.isAfter(toDate); day = day.plusDays(1)) {
            DayOfWeek dow = day.getDayOfWeek();
            if (dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY) continue;

            DoctorSchedule sch = scheduleByDate.get(day);

            // ✅ If no schedule row exists -> treat as OFF (no availability)
            if (sch == null) continue;

            // ✅ If TIME_OFF -> no slots that day
            if (sch.getType() == ScheduleType.TIME_OFF) continue;

            // ✅ AVAILABLE: must have times
            LocalTime startWork = sch.getStartTime();
            LocalTime endWork = sch.getEndTime();

            if (startWork == null || endWork == null || !endWork.isAfter(startWork)) {
                continue; // invalid availability row, ignore safely
            }

            LocalDateTime cursor = day.atTime(startWork);
            LocalDateTime end = day.atTime(endWork);

            while (cursor.isBefore(end)) {
                boolean available = !booked.contains(cursor);

                slots.add(Map.of(
                        "startIso", cursor.toString(),  // e.g. 2026-02-24T09:30
                        "available", available
                ));

                cursor = cursor.plusMinutes(slotMinutes);
            }
        }

        return ResponseEntity.ok(Map.of(
                "doctorId", doctorId,
                "from", fromDate.toString(),
                "to", toDate.toString(),
                "slotMinutes", slotMinutes,
                "slots", slots
        ));
    }

    // ✅ 4) Book
    // URL: POST /api/admin/appointments/book
    @PostMapping("/book")
    public ResponseEntity<?> book(
            @RequestBody Map<String, String> req,
            Authentication auth
    ) {
        if (!isAdmin(auth)) return ResponseEntity.status(403).body("Forbidden");

        String triageId = req.get("triageId");
        String doctorId = req.get("doctorId");
        String dateTime = req.get("dateTime");
        String type = req.get("type");
        String note = req.getOrDefault("note", "");

        if (triageId == null || triageId.isBlank()) return ResponseEntity.badRequest().body("triageId is required");
        if (doctorId == null || doctorId.isBlank()) return ResponseEntity.badRequest().body("doctorId is required");
        if (dateTime == null || dateTime.isBlank()) return ResponseEntity.badRequest().body("dateTime is required");
        if (type == null || type.isBlank()) return ResponseEntity.badRequest().body("type is required");

        LocalDateTime dt;
        try {
            dt = LocalDateTime.parse(dateTime.trim());
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body("Invalid dateTime (use ISO e.g. 2026-02-20T14:30)");
        }

        TriageRequest tr = triageRepo.findByTriageId(triageId).orElse(null);
        if (tr == null) return ResponseEntity.status(404).body("Triage not found: " + triageId);

        if (apptRepo.existsByDoctorIdAndDateTime(doctorId, dt)) {
            return ResponseEntity.status(409).body("Slot already booked");
        }

        String apptId = "apt-" + String.format("%06d", random.nextInt(1_000_000));

        Appointment appt = new Appointment();
        appt.setAppointmentId(apptId);
        appt.setUserId(tr.getUserId());
        appt.setDoctorId(doctorId);
        appt.setTriageId(triageId);
        appt.setDateTime(dt);
        appt.setType(type.trim().toUpperCase());
        appt.setNote(note);
        appt.setCreatedAt(LocalDateTime.now());

        apptRepo.save(appt);

        tr.setAssignedAppointmentId(apptId);
        tr.setDecidedBy(auth.getName());
        tr.setDecidedAt(LocalDateTime.now());
        tr.setStatus(TriageStatus.APPOINTMENT_ASSIGNED);
        triageRepo.save(tr);

        // ✅ Create message BEFORE returning
        String doctorName = doctorId;

        var docOpt = userRepo.findById(doctorId);
        if (docOpt.isPresent()) {
            User doc = docOpt.get();

            String fn = doc.getFirstName() == null ? "" : doc.getFirstName().trim();
            String ln = doc.getLastName() == null ? "" : doc.getLastName().trim();
            String full = (fn + " " + ln).trim();

            if (!full.isBlank()) {
                doctorName = full;
            } else if (doc.getEmail() != null && !doc.getEmail().isBlank()) {
                doctorName = doc.getEmail();
            }
        }

        String location = "MediPortal Clinic (Reception)"; // TODO: replace with real address/room

        Message m = new Message();
        m.setToUserId(tr.getUserId());     // patient user id (make sure this is the actual User.id)
        m.setFromUser("SYSTEM");
        m.setSubject("Appointment booked");
        m.setAppointmentId(appt.getAppointmentId());
        m.setBody(
                "Hi,\n\n" +
                        "Your appointment has been booked.\n\n" +
                        "Doctor: " + doctorName + "\n" +
                        "When: " + dt.toLocalDate() + " at " + dt.toLocalTime().withSecond(0).withNano(0) + "\n" +
                        "Where: " + location + "\n" +
                        "Type: " + appt.getType() + "\n\n" +
                        "If you can’t attend, please contact the practice.\n"
        );

        messageRepo.save(m);

        return ResponseEntity.ok(Map.of(
                "appointment", appt,
                "triage", tr,
                "message", m
        ));
    }
}