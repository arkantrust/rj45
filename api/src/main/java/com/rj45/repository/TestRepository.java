package com.rj45.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.List;

import com.rj45.model.Test;

@Repository
public interface TestRepository extends JpaRepository<Test, UUID> {

    List<Test> findByEvaluatorId(Long evaluatorId);

    List<Test> findByPatientId(Long patientId);

    @Query("SELECT t FROM Test t WHERE t.evaluator.id = :evaluatorId AND t.patient.id = :patientId")
    List<Test> findByEvaluatorIdAndPatientId(Long evaluatorId, Long patientId);

}
