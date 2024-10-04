package com.rj45.controller;

import com.rj45.model.Test;
import com.rj45.service.TestService;

import jakarta.persistence.EntityNotFoundException;

import com.rj45.dto.TestDto;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/tests")
@RequiredArgsConstructor
public class TestController {

    private final TestService service;

    @GetMapping
    public ResponseEntity<?> notAllowed() {
        return ResponseEntity.status(405).body("Method not allowed");
    }

    @PostMapping
    public ResponseEntity<?> addTest(@RequestBody TestDto test) {
        try {
            service.addTest(test);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> addTest(@PathVariable String id) {
        try {
            Test test = service.getTest(id);
            return ResponseEntity.ok(test);
        } catch (IllegalArgumentException | EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
