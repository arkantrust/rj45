package com.rj45.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import java.util.Date;
import javax.crypto.SecretKey;

import com.rj45.model.User;

@Service
public class JwtService {

    @Value("${application.security.jwt.secret-key}")
    private String secret;

    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration;

    @Value("${application.security.jwt.refresh-token.expiration}")
    private long refreshExpiration;

    /**
     * Generates a JWT access token for the given user
     * @param u
     * @return
     */
    public String generate(final User u) {
        return build(u, jwtExpiration);
    }

    /**
     * Generates a JWT refresh token for the given user
     * @param u
     * @return
     */
    public String generateRefresh(final User u) {
        return build(u, refreshExpiration);
    }

    /**
     * Builds a JWT token for the given user and expiration time
     * @param u
     * @param exp
     * @return
     */
    private String build(final User u, final long exp) {
        return Jwts.builder()
            // TODO: Use private claims to store user data
            .claim("role", u.getRole().toString())
            .claim("email", u.getEmail())
            .claim("name", u.getName())
            .subject(u.getId().toString())
            .issuedAt(new Date(System.currentTimeMillis()))
            .expiration(new Date(System.currentTimeMillis() + exp))
            .signWith(getSignInKey())
            .compact();
    }

    public Claims extractClaims(String token) {
        return Jwts.parser()
            .verifyWith(getSignInKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    public String extractEmail(String token) {
        return (String) extractClaims(token).get("email");
    }

    public boolean verify(String token, User u) {
        final String username = extractEmail(token);
        return (username.equals(u.getEmail())) && !isTokenExpiredOrRevoked(token);
    }

    public boolean verify(String token) {
        return !isTokenExpiredOrRevoked(token);
    }

    // TODO: Use a blacklist in Redis to store revoked tokens
    public boolean isTokenExpiredOrRevoked(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration();
    }

    private SecretKey getSignInKey() {
        final byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

}
