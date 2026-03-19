package com.consdev.mediportal.repository;

import com.consdev.mediportal.entities.Allergy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AllergyRepository extends JpaRepository<Allergy, Long> {
    List<Allergy> findByUser_IdOrderByRecordedAtDesc(String userId);

    List<Allergy> findByUser_Id(String userId);

    boolean existsByUser_IdAndAllergenIgnoreCase(String userId, String allergen);
}