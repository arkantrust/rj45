package com.rj45.controller;

import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.EntityExistsException;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;

import io.jsonwebtoken.JwtException;

import lombok.RequiredArgsConstructor;

import com.rj45.service.AuthnService;

// TODO: Return JWT token in httpOnly secure cookie
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class AuthnController {

    private final AuthnService service;

    private record SignUpRequest(
            String name,
            String email,
            String nationalId,
            String password) {};

    @PostMapping("/sign-up")
    public ResponseEntity<?> signUp(@RequestBody SignUpRequest req) {
        try {
            service.signUp(req.name(), req.email(), req.nationalId(), req.password());
            return ResponseEntity.ok().build();
        } catch (EntityExistsException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private record SignInRequest(String username, String password) {};

    @PostMapping("/sign-in")
    public ResponseEntity<?> signIn(@RequestBody SignInRequest req) {
        try {
            var authn = service.signIn(req.username(), req.password());
            return ResponseEntity.ok(authn);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/refresh/{id}")
    public ResponseEntity<?> refreshToken(@RequestHeader("Authorization") String authzHeader, @PathVariable Long id) {
        String token = authzHeader.substring(7);
        try {
            var authn = service.refresh(token, id);
            return ResponseEntity.ok(authn);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (JwtException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/reset")
    public ResponseEntity<?> getMagicLink(@RequestParam String email) {
        try {
            service.sendMagicLink(email);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reset/{code}")
    public ResponseEntity<?> resetPassword(@PathVariable String code, @RequestBody String newPassword) {
        try {
            service.resetPassword(code, newPassword);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reactivate")
    public ResponseEntity<?> activateAccount(@RequestBody SignInRequest req) {
        try {
            service.reactivateAccount(req.username(), req.password());
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<?> getVerificationCode(@RequestParam String email) {
        try {
            service.getVerificationCode(email);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyEmail(@RequestParam String email, @RequestParam String activationCode) {
        try {
            service.verifyEmail(email, activationCode);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
