package com.srms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.srms.dto.request.ReevaluationRequestDto;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.ReevaluationResponse;
import com.srms.service.ReevaluationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/student/reevaluation")
@RequiredArgsConstructor
public class ReevaluationController {

        private final ReevaluationService reevaluationService;

        // =========================================================
        // STUDENT - APPLY
        // =========================================================

        @PostMapping
        public ResponseEntity<ApiResponse<ReevaluationResponse>> applyForReevaluation(
                        @Valid @RequestBody ReevaluationRequestDto request,
                        Authentication authentication) {

                return ResponseEntity.ok(
                                reevaluationService.applyForReevaluation(
                                                authentication.getName(),
                                                request));
        }

        // =========================================================
        // STUDENT - MY REQUESTS
        // =========================================================

        @GetMapping("/my-requests")
        public ResponseEntity<ApiResponse<List<ReevaluationResponse>>> getMyReevaluationRequests(
                        Authentication authentication) {

                return ResponseEntity.ok(
                                reevaluationService.getMyReevaluationRequests(
                                                authentication.getName()));
        }

        // =========================================================
        // STUDENT - CANCEL
        // =========================================================

        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponse<Void>> cancelReevaluation(
                        @PathVariable Long id,
                        Authentication authentication) {

                return ResponseEntity.ok(
                                reevaluationService.cancelReevaluation(
                                                authentication.getName(),
                                                id));
        }
}