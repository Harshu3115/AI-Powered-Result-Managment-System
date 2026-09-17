package com.srms.config;

import com.srms.security.CustomUserDetailsService;
import com.srms.security.jwt.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;

        private final CustomUserDetailsService customUserDetailsService;

        // =========================================================
        // PASSWORD ENCODER
        // =========================================================

        @Bean
        PasswordEncoder passwordEncoder() {

                return new BCryptPasswordEncoder();
        }

        // =========================================================
        // AUTHENTICATION PROVIDER
        // =========================================================

        @Bean
        AuthenticationProvider authenticationProvider() {

                DaoAuthenticationProvider provider = new DaoAuthenticationProvider();

                provider.setUserDetailsService(
                                customUserDetailsService);

                provider.setPasswordEncoder(
                                passwordEncoder());

                return provider;
        }

        // =========================================================
        // AUTHENTICATION MANAGER
        // =========================================================

        @Bean
        AuthenticationManager authenticationManager(
                        AuthenticationConfiguration configuration)
                        throws Exception {

                return configuration.getAuthenticationManager();
        }

        // =========================================================
        // CORS CONFIGURATION
        // =========================================================

        @Bean
        CorsConfigurationSource corsConfigurationSource() {

                CorsConfiguration configuration = new CorsConfiguration();

                configuration.setAllowedOrigins(
                                Arrays.asList(
                                                "http://localhost:5173",
                                                "http://localhost:5174"));

                configuration.setAllowedMethods(
                                Arrays.asList(
                                                "GET",
                                                "POST",
                                                "PUT",
                                                "DELETE",
                                                "PATCH",
                                                "OPTIONS"));

                configuration.setAllowedHeaders(
                                Arrays.asList(
                                                "Authorization",
                                                "Content-Type",
                                                "Accept"));

                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

                source.registerCorsConfiguration(
                                "/**",
                                configuration);

                return source;
        }

        // =========================================================
        // SECURITY FILTER CHAIN
        // =========================================================

        @Bean
        SecurityFilterChain securityFilterChain(
                        HttpSecurity http)
                        throws Exception {

                http
                                // =================================================
                                // CSRF
                                // =================================================
                                .csrf(csrf -> csrf.disable())

                                // =================================================
                                // CORS
                                // =================================================
                                .cors(cors -> {
                                })

                                // =================================================
                                // JWT SESSION
                                // =================================================
                                .sessionManagement(session -> session.sessionCreationPolicy(
                                                SessionCreationPolicy.STATELESS))

                                // =================================================
                                // AUTHORIZATION
                                // =================================================
                                .authorizeHttpRequests(auth -> auth

                                                .requestMatchers("/api/fabmyy/**")
                                                .permitAll()

                                                .requestMatchers("/uploads/**")
                                                .permitAll()

                                                .requestMatchers(
                                                                "/swagger-ui/**",
                                                                "/swagger-ui.html",
                                                                "/v3/api-docs/**")
                                                .permitAll()

                                                .requestMatchers("/api/login")
                                                .permitAll()

                                                .requestMatchers("/api/auth/**")
                                                .permitAll()

                                                // WEBSOCKET
                                                .requestMatchers("/ws/**")
                                                .permitAll()

                                                .requestMatchers("/api/admin/**")
                                                .hasRole("ADMIN")

                                                .requestMatchers("/api/student/ai/admin/**")
                                                .hasRole("ADMIN")

                                                .requestMatchers("/api/teacher/**")
                                                .hasRole("TEACHER")

                                                .requestMatchers("/api/student/**")
                                                .hasRole("STUDENT")

                                                .anyRequest()
                                                .authenticated())

                                // =================================================
                                // AUTHENTICATION PROVIDER
                                // =================================================
                                .authenticationProvider(
                                                authenticationProvider())

                                // =================================================
                                // JWT FILTER
                                // =================================================
                                .addFilterBefore(
                                                jwtAuthenticationFilter,
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}