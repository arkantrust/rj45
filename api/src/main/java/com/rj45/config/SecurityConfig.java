package com.rj45.config;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import lombok.RequiredArgsConstructor;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthnFilter jwtAuthnFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable()) // JWT does not require CSRF
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS with custom config
            .httpBasic(httpBasic -> httpBasic.disable())
            .formLogin(formLogin -> formLogin.disable())
            .rememberMe(rememberMe -> rememberMe.disable())
            // .anonymous(anonymous -> anonymous.disable())
            // .requestCache(requestCache -> requestCache.disable())
            // .securityContext(securityContext -> securityContext.disable())
            // .servletApi(servletApi -> servletApi.disable())
            // .headers(headers -> headers.frameOptions(frameOptions ->
            // frameOptions.disable()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/auth/**",
                    "/docs",
                    "/health",
                    "/api.json",
                    "/swagger-ui/**",
                    "/tests/**" // Provisional config to avoid breaking the hardware functioning
                )
                .permitAll()
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((req, res, e) -> res.sendError(401, "UNAUTHORIZED"))
                .accessDeniedHandler((req, res, e) -> res.sendError(401, "UNAUTHORIZED"))
            )
            .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
            .addFilterBefore(jwtAuthnFilter, UsernamePasswordAuthenticationFilter.class);
            // .logout(logout -> logout
            //     .logoutUrl("/auth/sign-out")
            //     .addLogoutHandler(this::logout)
            //     .logoutSuccessHandler((req, res, authn) -> SecurityContextHolder.clearContext())
            // );

        return http.build();
    }

    @Bean
    public CorsFilter corsFilter() {
        return new CorsFilter(corsConfigurationSource());
    }

    private UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*")); // Allow all origins
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Allow all methods
        config.setAllowedHeaders(List.of("*")); // Allow all headers
        config.setAllowCredentials(true); // Allow credentials (cookies, etc.)

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // Apply to all endpoints
        return source;
    }

    // private void logout(
    //         final HttpServletRequest req,
    //         final HttpServletResponse res,
    //         final Authentication authn
    // ) {
    //     final String authzHeader = req.getHeader(HttpHeaders.AUTHORIZATION);
    //     if (authzHeader == null || !authzHeader.startsWith("Bearer "))
    //         return;

    //     // final String jwt = authzHeader.substring(7);
    //     // TODO: Invalidate JWT token with a Redis blacklist
    // }

}