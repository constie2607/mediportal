package com.consdev.mediportal.controller;

import com.consdev.mediportal.dto.TriageRequestDto;
import com.consdev.mediportal.entities.TriageRequest;
import com.consdev.mediportal.entities.User;
import com.consdev.mediportal.enums.TriageStatus;
import com.consdev.mediportal.repository.TriageRequestRepository;
import com.consdev.mediportal.repository.UserRepository;
import com.consdev.mediportal.service.SymptomCheckService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.security.SecureRandom;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/patient/triage-requests")
public class PatientTriageController {

    private final TriageRequestRepository repo;
    private final UserRepository userRep;
    private final SymptomCheckService symptomCheckService;
    private final ObjectMapper objectMapper;

    private static final SecureRandom random = new SecureRandom();

    public PatientTriageController(
            TriageRequestRepository repo,
            UserRepository userRep,
            SymptomCheckService symptomCheckService,
            ObjectMapper objectMapper
    ) {
        this.repo = repo;
        this.userRep = userRep;
        this.symptomCheckService = symptomCheckService;
        this.objectMapper = objectMapper;
    }

    @GetMapping
    public ResponseEntity<?> getMyTriageRequests(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body("Not logged in");
        }

        String principal = auth.getName().trim();

        User user = userRep.findById(principal).orElse(null);
        if (user == null) user = userRep.findByEmail(principal).orElse(null);

        if (user == null) {
            return ResponseEntity.status(401).body("User not found for principal: " + principal);
        }

        return ResponseEntity.ok(repo.findByUserIdOrderByCreatedAtDesc(user.getId()));
    }

    @PostMapping
    public ResponseEntity<?> createTriageRequest(@RequestBody TriageRequestDto req, Authentication auth) throws Exception {

        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body("Not logged in.");
        }

        if (req.getProblem() == null || req.getProblem().isBlank()) {
            return ResponseEntity.badRequest().body("Problem description is required");
        }
        if (req.getDuration() == null || req.getDuration().isBlank()) {
            return ResponseEntity.badRequest().body("Duration is required");
        }

        String principal = auth.getName().trim();

        User user = userRep.findById(principal).orElse(null);
        if (user == null) user = userRep.findByEmail(principal).orElse(null);

        if (user == null) {
            return ResponseEntity.status(401).body("User not found for principal: " + principal);
        }

        // Generate triage id
        int num = random.nextInt(1000000);
        String tId = "trg-" + String.format("%06d", num);

        // ✅ NEW: pass structured symptoms into the engine
        var ai = symptomCheckService.assess(
                req.getSeverity(),
                req.getDurationDays(),
                req.getRedFlags(),
                req.getProblem(),
                req.getSymptoms() // ✅ add this
        );

        TriageRequest tr = new TriageRequest();
        tr.setTriageId(tId);
        tr.setUserId(user.getId());

        tr.setProblem(req.getProblem());
        tr.setDuration(req.getDuration());
        tr.setTried(req.getTried());
        tr.setWorried(req.getWorried());
        tr.setHelpWanted(req.getHelpWanted());
        tr.setBestTimes(req.getBestTimes());
        tr.setStatus(TriageStatus.PENDING);

        // ✅ OPTIONAL BUT RECOMMENDED: store the structured symptoms submitted
        // (requires you add 'symptoms' field to the entity — see below)
        tr.setSymptoms(req.getSymptoms());

        // Save AI output (existing)
        tr.setAiUrgencyLevel(ai.urgencyLevel);
        tr.setAiRecommendedAction(ai.recommendedAction);
        tr.setAiSelfCareAdvice(objectMapper.writeValueAsString(ai.selfCareAdvice));
        tr.setAiSafetyNet(objectMapper.writeValueAsString(ai.safetyNet));
        tr.setAiRedFlagsTriggered(objectMapper.writeValueAsString(ai.redFlagsTriggered));
        tr.setAiClinicianSummary(ai.clinicianSummary);
        tr.setAiGeneratedAt(LocalDateTime.now());

        // ✅ NEW: save explainability + scoring fields (requires entity fields)
        tr.setAiRiskScore(ai.riskScore);
        tr.setAiKeywordsMatched(objectMapper.writeValueAsString(ai.keywordsMatched));
        tr.setAiPathwaysMatched(objectMapper.writeValueAsString(ai.pathwaysMatched));
        tr.setAiStructuredSymptomsMatched(objectMapper.writeValueAsString(ai.structuredSymptomsMatched));

        return ResponseEntity.ok(repo.save(tr));
    }
}
