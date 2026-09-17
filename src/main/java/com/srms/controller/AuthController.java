package com.srms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.srms.dto.request.ForgotPasswordRequest;
import com.srms.dto.request.LoginRequest;
import com.srms.dto.request.RegisterRequest;
import com.srms.dto.request.ResetPasswordRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.LoginResponse;
import com.srms.service.AuthService;
import com.srms.service.PasswordResetService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

        private final AuthService authService;

        private final PasswordResetService passwordResetService;

        @PostMapping("/register")
        public ResponseEntity<ApiResponse<String>> register(
                        @Valid @RequestBody RegisterRequest request) {

                return ResponseEntity.ok(
                                authService.register(request));
        }

        @PostMapping("/login")
        public ResponseEntity<ApiResponse<LoginResponse>> login(
                        @Valid @RequestBody LoginRequest request) {

                return ResponseEntity.ok(
                                authService.login(request));
        }

        // Forgot Password
        @PostMapping("/forgot-password")
        public ResponseEntity<ApiResponse<String>> forgotPassword(
                        @Valid @RequestBody ForgotPasswordRequest request) {

                String message = passwordResetService.forgotPassword(
                                request.getEmail());

                return ResponseEntity.ok(
                                ApiResponse.<String>builder()
                                                .success(true)
                                                .message(message)
                                                .data(null)
                                                .build());
        }

        // Reset Password
        @PostMapping("/reset-password")
        public ResponseEntity<ApiResponse<String>> resetPassword(
                        @Valid @RequestBody ResetPasswordRequest request) {

                passwordResetService.resetPassword(
                                request.getToken(),
                                request.getNewPassword());

                return ResponseEntity.ok(
                                ApiResponse.<String>builder()
                                                .success(true)
                                                .message(
                                                                "Password reset successfully.")
                                                .data(null)
                                                .build());
        }
}