package com.consdev.mediportal.repository;

import com.consdev.mediportal.entities.FamilyHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FamilyHistoryRepository extends JpaRepository<FamilyHistory, Long> {
    List<FamilyHistory> findByUser_IdOrderByRecordedAtDesc(String patientId);
}