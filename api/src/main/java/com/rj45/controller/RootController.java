package com.rj45.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "*")
public class RootController {
    
    @GetMapping
    public ResponseEntity<?> getRoot() {
        return ResponseEntity.ok("RJ45 API");
    }

    @GetMapping("/health")
    public ResponseEntity<?> getHealth() {
        return ResponseEntity.ok("OK");
    }

    @GetMapping("/docs")
    public ResponseEntity<?> getDocs() {
        return ResponseEntity.ok("API documentation coming soon!");
    }

    @GetMapping("/error")
    public ResponseEntity<?> getError() {
        return ResponseEntity.badRequest().body("An error occurred");
    }

}
