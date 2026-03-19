package com.consdev.mediportal.repository;

import com.consdev.mediportal.entities.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, String> {
    List<Appointment> findByDoctorIdAndDateTimeBetween(
            String doctorId,
            LocalDateTime from,
            LocalDateTime to
    );

    boolean existsByDoctorIdAndDateTime(String doctorId, LocalDateTime dateTime);

}
