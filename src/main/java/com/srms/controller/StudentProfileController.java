package com.srms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.srms.dto.request.ChangePasswordRequest;
import com.srms.dto.request.StudentProfileRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.StudentProfileResponse;
import com.srms.service.StudentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentProfileController {

    private final StudentService studentService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> getMyProfile(
            Authentication authentication) {

        return ResponseEntity.ok(
                studentService.getMyProfile(
                        authentication.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> updateMyProfile(
            @Valid @RequestBody StudentProfileRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                studentService.updateMyProfile(
                        authentication.getName(),
                        request));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                studentService.changePassword(
                        authentication.getName(),
                        request));
    }

}