package com.consdev.mediportal.repository;

import com.consdev.mediportal.entities.MedicalCondition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicalConditionRepository extends JpaRepository<MedicalCondition, Long> {
    List<MedicalCondition> findByUser_IdOrderByRecordedAtDesc(String patientId);
}