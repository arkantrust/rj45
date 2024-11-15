package com.rj45.controller;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.http.ResponseEntity;

import lombok.RequiredArgsConstructor;

import com.rj45.service.UserService;
import com.rj45.model.User;

// TODO: JWT authorization
@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    private record UserResponse(
        Long id,
        String name,
        String email,
        String nationalId,
        String role
    ) {
        public UserResponse(User u) {
            this(u.getId(), u.getName(), u.getEmail(), u.getNationalId(), u.getRole().toString());
        }
    };

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            var u = service.getById(id);
            return ResponseEntity.ok(new UserResponse(u));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping()
    public ResponseEntity<?> getByUsername(@RequestParam("username") String username) {
        try {
            var u = service.getByUsername(username);
            return ResponseEntity.ok(new UserResponse(u));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private record UpdateUserRequest(Long id, String name, String email, String nationalId) {};

    @PutMapping
    public ResponseEntity<?> update(@RequestBody UpdateUserRequest u) {
        try {
            var updated = service.update(u.id(), u.name(), u.email(), u.nationalId());
            return ResponseEntity.ok(new UserResponse(updated));
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
