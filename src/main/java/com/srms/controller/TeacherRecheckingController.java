package com.srms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.srms.dto.request.TeacherRecheckingCompleteRequest;
import com.srms.dto.request.TeacherRecheckingReviewRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.RecheckingSubjectResponse;
import com.srms.service.RecheckingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/teacher/rechecking")
@RequiredArgsConstructor
public class TeacherRecheckingController {

        private final RecheckingService recheckingService;

        // Teacher views assigned rechecking requests
        @GetMapping
        public ResponseEntity<ApiResponse<List<RecheckingSubjectResponse>>> getMyRecheckingRequests(
                        Authentication authentication) {

                return ResponseEntity.ok(
                                recheckingService.getTeacherRecheckingRequests(
                                                authentication.getName()));
        }

        // Teacher approves or rejects a rechecking request
        @PutMapping("/{id}/review")
        public ResponseEntity<ApiResponse<RecheckingSubjectResponse>> reviewRecheckingRequest(
                        @PathVariable Long id,
                        @Valid @RequestBody TeacherRecheckingReviewRequest request,
                        Authentication authentication) {

                return ResponseEntity.ok(
                                recheckingService.reviewRecheckingRequest(
                                                authentication.getName(),
                                                id,
                                                request));
        }

        @PutMapping("/{id}/complete")
        public ResponseEntity<ApiResponse<RecheckingSubjectResponse>> completeRechecking(
                        @PathVariable Long id,
                        @Valid @RequestBody TeacherRecheckingCompleteRequest request,
                        Authentication authentication) {

                return ResponseEntity.ok(
                                recheckingService.completeRechecking(
                                                authentication.getName(),
                                                id,
                                                request));
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponse<String>> deleteRecheckingRequest(
                        Authentication authentication,
                        @PathVariable Long id) {

                return ResponseEntity.ok(
                                recheckingService.deleteRecheckingRequest(
                                                authentication.getName(),
                                                id));
        }
}