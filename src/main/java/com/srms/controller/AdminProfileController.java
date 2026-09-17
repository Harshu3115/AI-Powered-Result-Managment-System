package com.srms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.srms.dto.request.AdminProfileUpdateRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.AdminProfileResponse;
import com.srms.service.AdminProfileService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/profile")
@RequiredArgsConstructor
public class AdminProfileController {

    private final AdminProfileService adminProfileService;

    @GetMapping
    public ResponseEntity<ApiResponse<AdminProfileResponse>> getProfile(
            Authentication authentication) {

        return ResponseEntity.ok(
                adminProfileService.getProfile(
                        authentication.getName()));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<AdminProfileResponse>> updateProfile(
            @Valid @RequestBody AdminProfileUpdateRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                adminProfileService.updateProfile(
                        authentication.getName(),
                        request));
    }
}