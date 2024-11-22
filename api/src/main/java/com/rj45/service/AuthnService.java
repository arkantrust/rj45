package com.rj45.service;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.JwtException;

import lombok.RequiredArgsConstructor;

import com.rj45.repository.UserRepository;
import com.rj45.model.User;
import com.rj45.model.Role;
import com.rj45.util.EmailValidator;
import com.rj45.util.NationalIdValidator;
import com.rj45.dto.AuthnResponse;

@Service
@RequiredArgsConstructor
public class AuthnService {

    private final UserRepository userRepo;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    public void signUp(String name, String email, String nationalId, String password)
            throws EntityExistsException, IllegalArgumentException {

        if (!new EmailValidator(email).isValid())
            throw new IllegalArgumentException("INVALID_EMAIL");

        if (!new NationalIdValidator(nationalId).isValid())
            throw new IllegalArgumentException("INVALID_NATIONAL_ID");

        // Only if we found a conflict, we do a detailed check to provide a more
        // informative error message
        if (userRepo.existsByEmailOrNationalId(email, nationalId)) {
            if (userRepo.existsByEmail(email))
                throw new EntityExistsException("EMAIL_ALREADY_REGISTERED");

            if (userRepo.existsByNationalId(nationalId))
                throw new EntityExistsException("NATIONAL_ID_ALREADY_REGISTERED");
        }

        var u = User.builder()
            .name(name)
            .email(email)
            .nationalId(nationalId)
            .password(passwordEncoder.encode(password))
            .role(Role.EVALUATOR)
            .active(true)
            .build();

        userRepo.save(u);
    }

    public AuthnResponse signIn(String username, String password)
            throws EntityNotFoundException, BadCredentialsException {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (Exception e) {
            System.out.println(e);
        }

        var box = userRepo.findByUsername(username);

        if (box.isEmpty())
            throw new EntityNotFoundException("USER_NOT_FOUND");

        var u = box.get();

        var access = jwtService.generate(u);
        var refresh = jwtService.generateRefresh(u);
        return new AuthnResponse(access, refresh, u.getId());
    }

    public AuthnResponse refresh(String refreshToken, Long id) throws EntityNotFoundException, JwtException {
        var u = userRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("USER_NOT_FOUND"));
        var validToken = jwtService.verify(refreshToken, u);

        if (!validToken)
            throw new JwtException("INVALID_REFRESH_TOKEN");

        var access = jwtService.generate(u);
        var refresh = jwtService.generateRefresh(u);
        return new AuthnResponse(access, refresh, u.getId());
    }

    public String sendMagicLink(String email) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getMagicLink'");
    }

    public void resetPassword(String magicLink, String newPassword) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'resetPassword'");
    }

    public void reactivateAccount(String username, String password) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'activateAccount'");
    }

    public void getVerificationCode(String email) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getVerificationCode'");
    }

    public void verifyEmail(String email, String activationCode) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'verifyEmail'");
    }

}
