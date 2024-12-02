package com.rj45.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.User;

import com.rj45.service.UserService;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class AppConfig {

    // For these parameters see the whitepaper
    // (https://github.com/P-H-C/phc-winner-argon2/blob/master/argon2-specs.pdf),
    // Section 9
    public static final int SALT_LENGTH = 128 / 8; // 128 bits
    public static final int HASH_LENGTH = 256 / 8; // 256 bits
    public static final int PARALLELISM = 1;
    public static final int MEMORY_COST = 16 * 1024; // 16 MB
    public static final int ITERATIONS = 10;

    private final UserService userService;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            var u = userService.getByUsername(username);
            return User.builder()
                .username(u.getEmail())
                .password(u.getPassword())
                .roles(u.getRole().toString())
                .build();
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // TODO: Use Argon2id instead of BCrypt
        // return new Argon2PasswordEncoder(SALT_LENGTH, HASH_LENGTH, PARALLELISM, MEMORY_COST, ITERATIONS);
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(final AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public RestTemplate restTemplate(){
        return new RestTemplate();
    }

}
