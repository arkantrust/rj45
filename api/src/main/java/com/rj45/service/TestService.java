package com.rj45.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.rj45.dto.TestDto;
import com.rj45.model.Test;
import com.rj45.repository.TestRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TestService {

    private final TestRepository repo;

    public void addTest(TestDto test) throws IllegalArgumentException {

        if (test.measurements().isEmpty()) {
            throw new IllegalArgumentException("Test must have at least one measurement");
        }

        if (test.type().equalsIgnoreCase("footing") ||
                test.type().equalsIgnoreCase("heeling")) {
            throw new IllegalArgumentException("Test type must be either 'footing' or 'heeling'");
        }

        Test newTest = Test.builder()
                .id(UUID.randomUUID().toString())
                .type(test.type())
                .measurements(test.measurements())
                .timestamp(LocalDateTime.now())
                .evaluatorId(0)
                .patientId(0)
                .build();

        repo.save(newTest);
    }

    public Test getTest(String id) throws EntityNotFoundException, IllegalArgumentException {

        // check id is a valid uuid
        try {
            UUID.fromString(id);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(id + " is not a valid UUID");
        }

        return repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Test not found with id " + id));
    }

}
