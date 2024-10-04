package com.rj45.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tests")
public class Test {

    @Id
    private String id;

    @Column(nullable = false)
    private String type;

    // use an array of jsonb objects to store the measurements
    @Column(columnDefinition = "jsonb")
    @Convert(converter = Measurement.class)
    private List<Measurement> measurements;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private int evaluatorId;

    @Column(nullable = false)
    private int patientId;

}
