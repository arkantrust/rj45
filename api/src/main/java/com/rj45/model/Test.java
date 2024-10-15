package com.rj45.model;

import org.hibernate.annotations.Type;
import io.hypersistence.utils.hibernate.type.array.ListArrayType;

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
import java.util.Map;
import java.util.UUID;

// TODO: https://vladmihalcea.com/postgresql-array-java-list/
// https://vladmihalcea.com/how-to-map-json-objects-using-generic-hibernate-types/
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

    @Type(ListArrayType.class)
    @Column(columnDefinition = "jsonb[]")
    private List<Map<String, Object>> measurements;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private int evaluatorId;

    @Column(nullable = false)
    private int patientId;

}
