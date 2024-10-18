package com.rj45.service;

import java.time.LocalDateTime;
import java.util.List;
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

        Test newTest = Test.builder()
                .id(UUID.randomUUID())
                .type(test.type())
                .measurements(test.measurements())
                .createdAt(LocalDateTime.now())
                .evaluatorId(0)
                .patientId(0)
                .build();

        repo.save(newTest);
    }

    public Test getTest(String id) throws EntityNotFoundException, IllegalArgumentException {

        UUID uuid = null;

        // check id is a valid uuid
        try {
            uuid = UUID.fromString(id);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(id + " is not a valid UUID");
        }

        return repo.findById(uuid).orElseThrow(
                () -> new EntityNotFoundException("Test not found with id " + id));
    }

    // TODO: use a patientId or evaluatorId to filter tests
    public List<Test> getAllTests() {
        return repo.findAll();
    }

}
