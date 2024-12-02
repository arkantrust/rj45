package com.rj45.model;

import org.hibernate.annotations.Type;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Column;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

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
    @Column(columnDefinition = "jsonb[]")
    private List<Measurement> measurements;

    @Column(name = "timestamp", nullable = false)
    private long timestamp;

    @ManyToOne(targetEntity = Patient.class)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(targetEntity = User.class)
    @JoinColumn(name = "evaluator_id", nullable = false)
    private User evaluator;

    @OneToMany(mappedBy = "test")
    private List<Comment> comments;

}
