package com.rj45.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.rj45.dto.UserDto;

@Entity
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    String name;

    @Column(nullable = false, unique = true)
    String email;

    // TODO: Use an enum class for different documents like passport, TI (for children), etc
    @Column(name = "national_id", nullable = false, unique = true)
    private String nationalId; // cedula

    @Column(nullable = false)
    String password;

    @Column(nullable = false)
    @Enumerated(value = EnumType.STRING)
    Role role;

    @Column(nullable = false, columnDefinition = "boolean default true")
    private boolean active;

    public UserDto toDto() {
        return new UserDto(id, name, email, nationalId, role.toString());
    }

}
