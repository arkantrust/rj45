package com.rj45.repository;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import com.rj45.model.Patient;


@Transactional
@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    public Optional<Patient> findByEmail(String nationalId);

    public Optional<Patient> findByNationalId(String nationalId);

    public boolean existsByEmail(String nationalId);

    public boolean existsByNationalId(String nationalId);

    public boolean existsByEmailOrNationalId(String email, String nationalId);

    @Modifying
    @Query("UPDATE Patient p SET p.discharged = true WHERE p.id = :id")
    public void discharge(@Param("id") Long id);

}
