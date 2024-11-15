package com.rj45.controller;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;

import lombok.RequiredArgsConstructor;

import com.rj45.service.PatientService;

// TODO: JWT authorization
@RestController
@RequestMapping("/patients")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class PatientController {

    private final PatientService service;

    @GetMapping()
    public ResponseEntity<?> getAll(@RequestParam(name="username", required=false) String username) {
        if (username != null) {
            try {
                var patient = service.getByUsername(username);
                return ResponseEntity.ok(patient);
            } catch (EntityNotFoundException e) {
                return ResponseEntity.notFound().build();
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }

        var patients = service.getAll();
        return ResponseEntity.status(200).body(patients);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            var patient = service.getById(id);
            return ResponseEntity.ok(patient);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    private record AddPatientRequest(String name, String email, String nationalId) {
    };

    @PostMapping()
    public ResponseEntity<?> add(@RequestBody AddPatientRequest p) {
        try {
            var added = service.add(p.name(), p.email(), p.nationalId());
            return ResponseEntity.ok(added);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private record UpdatePatientRequest(
        Long id,
        @Nullable String name,
        @Nullable String email,
        @Nullable String nationalId
        ) {};

    @PutMapping
    public ResponseEntity<?> update(@RequestBody UpdatePatientRequest p) {
        try {
            var updated = service.update(p.id(), p.name(), p.email(), p.nationalId());
            return ResponseEntity.ok(updated);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
