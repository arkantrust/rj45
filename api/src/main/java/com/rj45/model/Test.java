package com.rj45.model;

import org.hibernate.annotations.Type;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

// TODO: https://vladmihalcea.com/postgresql-array-java-list/
// https://vladmihalcea.com/how-to-map-json-objects-using-generic-hibernate-types/

@Entity
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tests")
public class Test {

    @Id
    private UUID id;

    @Column(nullable = false)
    private String type;

    @Type(MeasurementsList.class)
    @Column(columnDefinition = "jsonb[]", nullable = false)
    private List<Measurement> measurements;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "evaluator_id", nullable = false)
    private int evaluatorId;

    @Column(name = "patient_id", nullable = false)
    private int patientId;

}
