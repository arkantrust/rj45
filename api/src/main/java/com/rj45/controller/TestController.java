package com.rj45.controller;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;

import com.rj45.service.TestService;
import com.rj45.model.Measurement;

@RestController
@RequestMapping("/tests")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TestController {

    private final TestService service;

    @GetMapping()
    public ResponseEntity<?> getAll(
            @RequestParam(name = "evaluatorId", required = false) Long evaluatorId,
            @RequestParam(name = "patientId", required = false) Long patientId) {
        try {
            var tests = service.getAll(patientId, evaluatorId);
            return ResponseEntity.ok(tests);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable UUID id) {
        try {
            var test = service.getById(id);
            return ResponseEntity.ok(test);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private record AddTestRequest(
        String type,
        @Nullable List<Measurement> measurements,
        Long patientId,
        Long evaluatorId
    ) {};

    @PostMapping
    public ResponseEntity<?> add(@RequestBody AddTestRequest t) {
        try {
            var added = service.add(
                t.type(),
                t.measurements() != null ? t.measurements() : List.of(),
                t.patientId(),
                t.evaluatorId()
            );
            return ResponseEntity.ok(added);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private record UpdateTestRequest(
        UUID id,
        @Nullable String type,
        @Nullable List<Measurement> measurements,
        @Nullable Long patientId,
        @Nullable Long evaluatorId
    ) {};

    @PutMapping
    public ResponseEntity<?> update(@RequestBody UpdateTestRequest t) {
        try {
            var updated = service.update(t.id(), t.type(), t.measurements(), t.patientId(), t.evaluatorId());
            return ResponseEntity.ok(updated);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id) {
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
