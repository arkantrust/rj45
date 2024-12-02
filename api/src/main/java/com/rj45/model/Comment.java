package com.rj45.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.UUID;

@Entity
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "comments")
public class Comment {

    @Id
    private UUID id;

    @Column(nullable = false)
    private String content;

    @Column(name = "timestamp", nullable = false)
    private long timestamp;

    @ManyToOne(targetEntity = Test.class)
    @JoinColumn(name = "test_id", nullable = false)
    private Test test;

    // TODO: Add evaluator field

}
