package com.srms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.ReevaluationSubjectResponse;
import com.srms.service.ReevaluationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/teacher/reevaluation")
@RequiredArgsConstructor
public class TeacherReevaluationController {

        private final ReevaluationService reevaluationService;

        // =========================================================
        // TEACHER - GET ASSIGNED REQUESTS
        // =========================================================

        @GetMapping
        public ResponseEntity<ApiResponse<List<ReevaluationSubjectResponse>>> getTeacherReevaluationRequests(
                        Authentication authentication) {

                return ResponseEntity.ok(
                                reevaluationService.getTeacherReevaluationRequests(
                                                authentication.getName()));
        }

        // =========================================================
        // TEACHER - APPROVE / REJECT
        // =========================================================

        @PutMapping("/{id}/review")
        public ResponseEntity<ApiResponse<ReevaluationSubjectResponse>> reviewReevaluationRequest(
                        @PathVariable Long id,
                        @RequestParam String reviewResult,
                        Authentication authentication) {

                return ResponseEntity.ok(
                                reevaluationService.reviewReevaluationRequest(
                                                authentication.getName(),
                                                id,
                                                reviewResult));
        }

        // =========================================================
        // TEACHER - COMPLETE
        // =========================================================

        @PutMapping("/{id}/complete")
        public ResponseEntity<ApiResponse<ReevaluationSubjectResponse>> completeReevaluation(
                        @PathVariable Long id,
                        @RequestParam(required = false) Integer newMarks,
                        @RequestParam String reviewResult,
                        Authentication authentication) {

                return ResponseEntity.ok(
                                reevaluationService.completeReevaluation(
                                                authentication.getName(),
                                                id,
                                                newMarks,
                                                reviewResult));
        }

        // =========================================================
        // TEACHER - DELETE REEVALUATION REQUEST
        // =========================================================

        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponse<Void>> deleteReevaluationRequest(
                        @PathVariable Long id,
                        Authentication authentication) {

                return ResponseEntity.ok(
                                reevaluationService.deleteReevaluationRequest(
                                                authentication.getName(),
                                                id));
        }
}