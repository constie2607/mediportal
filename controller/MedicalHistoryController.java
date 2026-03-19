package com.consdev.mediportal.controller;

import com.consdev.mediportal.dto.medicalhistorydto.*;
import com.consdev.mediportal.service.MedicalHistoryService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class MedicalHistoryController {

    private final MedicalHistoryService medicalHistoryService;

    public MedicalHistoryController(MedicalHistoryService medicalHistoryService) {
        this.medicalHistoryService = medicalHistoryService;
    }

    @PostMapping("/{userId}/medical-history/allergies")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public AllergyDto addAllergy(
            @PathVariable String userId,
            @RequestBody CreateAllergyRequest request
    ) {
        return medicalHistoryService.addAllergy(userId, request);
    }
    // Patient can view their own OR staff can view (adjust roles)
    @GetMapping("/{userId}/medical-history")
    @PreAuthorize("@authz.canViewMedicalHistory(#userId, authentication)")
    public MedicalHistoryOverviewDto getMedicalHistory(@PathVariable String userId) {
        return medicalHistoryService.getMedicalHistory(userId);
    }

    @PutMapping("/{userId}/medical-history/allergies/{allergyId}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public AllergyDto updateAllergy(
            @PathVariable String userId,
            @PathVariable Long allergyId,
            @RequestBody CreateAllergyRequest request
    ) {
        return medicalHistoryService.updateAllergy(userId, allergyId, request);
    }
    @DeleteMapping("/{userId}/medical-history/allergies/{allergyId}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public void deleteAllergy(
            @PathVariable String userId,
            @PathVariable Long allergyId
    ) {
        medicalHistoryService.deleteAllergy(userId, allergyId);
    }

    @PostMapping("/{userId}/medical-history/conditions")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public MedicalConditionDto addCondition(
            @PathVariable String userId,
            @RequestBody CreateMedicalConditionRequest request
    ) {
        return medicalHistoryService.addCondition(userId, request);
    }

    @PutMapping("/{userId}/medical-history/conditions/{conditionId}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public MedicalConditionDto updateCondition(
            @PathVariable String userId,
            @PathVariable Long conditionId,
            @RequestBody CreateMedicalConditionRequest request
    ) {
        return medicalHistoryService.updateCondition(userId, conditionId, request);
    }

    @DeleteMapping("/{userId}/medical-history/conditions/{conditionId}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public void deleteCondition(
            @PathVariable String userId,
            @PathVariable Long conditionId
    ) {
        medicalHistoryService.deleteCondition(userId, conditionId);
    }

    @PostMapping("/{userId}/medical-history/procedures")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public ProcedureDto addProcedure(
            @PathVariable String userId,
            @RequestBody CreateProcedureRequest request
    ) {
        return medicalHistoryService.addProcedure(userId, request);
    }

    @PutMapping("/{userId}/medical-history/procedures/{procedureId}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public ProcedureDto updateProcedure(
            @PathVariable String userId,
            @PathVariable Long procedureId,
            @RequestBody CreateProcedureRequest request
    ) {
        return medicalHistoryService.updateProcedure(userId, procedureId, request);
    }

    @DeleteMapping("/{userId}/medical-history/procedures/{procedureId}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public void deleteProcedure(
            @PathVariable String userId,
            @PathVariable Long procedureId
    ) {
        medicalHistoryService.deleteProcedure(userId, procedureId);
    }

    @PostMapping("/{userId}/medical-history/family-history")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public FamilyHistoryDto addFamilyHistory(
            @PathVariable String userId,
            @RequestBody CreateFamilyHistoryRequest request
    ) {
        return medicalHistoryService.addFamilyHistory(userId, request);
    }

    @PutMapping("/{userId}/medical-history/family-history/{familyHistoryId}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public FamilyHistoryDto updateFamilyHistory(
            @PathVariable String userId,
            @PathVariable Long familyHistoryId,
            @RequestBody CreateFamilyHistoryRequest request
    ) {
        return medicalHistoryService.updateFamilyHistory(userId, familyHistoryId, request);
    }

    @DeleteMapping("/{userId}/medical-history/family-history/{familyHistoryId}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public void deleteFamilyHistory(
            @PathVariable String userId,
            @PathVariable Long familyHistoryId
    ) {
        medicalHistoryService.deleteFamilyHistory(userId, familyHistoryId);
    }

    @PutMapping("/{userId}/medical-history/social-history")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public SocialHistoryDto updateSocialHistory(
            @PathVariable String userId,
            @RequestBody UpdateSocialHistoryRequest request
    ) {
        return medicalHistoryService.updateSocialHistory(userId, request);
    }

    @PostMapping("/{userId}/medical-history/medications")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public MedicationDto addMedication(
            @PathVariable String userId,
            @RequestBody CreateMedicationRequest request
    ) {
        return medicalHistoryService.addMedication(userId, request);
    }

    @PutMapping("/{userId}/medical-history/medications/{medicationId}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public MedicationDto updateMedication(
            @PathVariable String userId,
            @PathVariable Long medicationId,
            @RequestBody CreateMedicationRequest request
    ) {
        return medicalHistoryService.updateMedication(userId, medicationId, request);
    }

    @DeleteMapping("/{userId}/medical-history/medications/{medicationId}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public void deleteMedication(
            @PathVariable String userId,
            @PathVariable Long medicationId
    ) {
        medicalHistoryService.deleteMedication(userId, medicationId);
    }
    @PostMapping("/{userId}/medical-history/prescription-requests")
    @PreAuthorize("@authz.canViewMedicalHistory(#userId, authentication)")
    public PrescriptionRequestDto createPrescriptionRequest(
            @PathVariable String userId,
            @RequestBody CreatePrescriptionRequestRequest request
    ) {
        return medicalHistoryService.createPrescriptionRequest(userId, request);
    }

    @PutMapping("/prescription-requests/{requestId}/review")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public PrescriptionRequestDto reviewPrescriptionRequest(
            @PathVariable Long requestId,
            @RequestBody ReviewPrescriptionRequestRequest request
    ) {
        return medicalHistoryService.reviewPrescriptionRequest(requestId, request);
    }

}
