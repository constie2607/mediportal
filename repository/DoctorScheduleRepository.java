package com.consdev.mediportal.repository;
import com.consdev.mediportal.entities.DoctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface DoctorScheduleRepository extends JpaRepository<DoctorSchedule, Long> {
    List<DoctorSchedule> findByDoctorIdAndDateBetween(String doctorId, LocalDate from, LocalDate to);
    List<DoctorSchedule> findByDateBetween(LocalDate from, LocalDate to);
    void deleteByDoctorIdAndDateIn(String doctorId, List<LocalDate> dates);
}