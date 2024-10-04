package com.rj45.controller;

import com.rj45.model.Test;
import com.rj45.repository.TestRepository;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/tests")
@RequiredArgsConstructor
public class TestController {

    private final TestRepository repo;

    @PostMapping
    public ResponseEntity<?> addTest(@RequestBody Test test) {
        test.setTimestamp(LocalDateTime.now());
        UUID uuid = UUID.randomUUID();
        String uuidAsString = uuid.toString();
        test.setId(uuidAsString);
        return ResponseEntity.ok(repo.save(test));
    }

}
