package com.srms.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.TeacherResponse;
import com.srms.service.TeacherService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
public class TeacherProfileController {

        private final TeacherService teacherService;

        // =========================================================
        // TEACHER - GET PROFILE
        // =========================================================

        @GetMapping("/profile")
        public ResponseEntity<ApiResponse<TeacherResponse>> getProfile(
                        Authentication authentication) {

                return ResponseEntity.ok(
                                teacherService.getTeacherProfile(
                                                authentication.getName()));
        }

        // =========================================================
        // TEACHER - UPDATE PROFILE + PROFILE IMAGE
        // =========================================================

        @PutMapping(value = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<ApiResponse<TeacherResponse>> updateProfile(

                        @RequestParam String firstName,

                        @RequestParam String lastName,

                        @RequestParam String email,

                        @RequestParam String mobile,

                        @RequestParam String department,

                        @RequestParam String qualification,

                        @RequestParam String designation,

                        @RequestParam String experience,

                        @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,

                        Authentication authentication) {

                return ResponseEntity.ok(
                                teacherService.updateProfile(
                                                authentication.getName(),
                                                firstName,
                                                lastName,
                                                email,
                                                mobile,
                                                department,
                                                qualification,
                                                designation,
                                                experience,
                                                profileImage));
        }
}