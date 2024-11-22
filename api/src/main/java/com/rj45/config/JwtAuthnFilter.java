package com.rj45.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import io.jsonwebtoken.JwtException;

import java.io.IOException;

import com.rj45.service.JwtService;

@Component
@Slf4j
@RequiredArgsConstructor
public class JwtAuthnFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest req, 
        @NonNull HttpServletResponse res, 
        @NonNull FilterChain fc
    ) throws ServletException, IOException {
        try {
            String token = extractJwtFromRequest(req);
            if (token == null)
                throw new JwtException("NO_ACCESS_TOKEN");

            if (!jwtService.verify(token))
                throw new JwtException("INVALID_ACCESS_TOKEN");

            String email = jwtService.extractEmail(token);

            if (email == null)
                throw new JwtException("INVALID_EMAIL");
    
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
    
            var authToken = new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
            );
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
            
            SecurityContextHolder.getContext().setAuthentication(authToken);
        } catch (JwtException e) {
            log.error(e.getMessage());
            // Don't set authentication - will result in 401
        }
        
        fc.doFilter(req, res);
    }
    
    private String extractJwtFromRequest(HttpServletRequest req) {
        String bearerToken = req.getHeader(HttpHeaders.AUTHORIZATION);
        if (bearerToken != null && !bearerToken.isBlank() && bearerToken.startsWith("Bearer "))
            return bearerToken.substring(7);

        return null;
    }

}