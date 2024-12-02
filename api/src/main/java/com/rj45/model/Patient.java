package com.rj45.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "patients")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "national_id", nullable = false, unique = true)
    private String nationalId;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private boolean discharged;

    @OneToMany(targetEntity = Test.class, mappedBy = "patient", cascade = CascadeType.ALL)
    private List<Test> tests;
    
}
