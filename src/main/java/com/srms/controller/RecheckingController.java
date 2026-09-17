package com.srms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.srms.dto.request.RecheckingRequestDto;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.RecheckingResponse;
import com.srms.service.RecheckingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/student/rechecking")
@RequiredArgsConstructor
public class RecheckingController {

        private final RecheckingService recheckingService;

        @PostMapping
        public ResponseEntity<ApiResponse<RecheckingResponse>> applyForRechecking(
                        @Valid @RequestBody RecheckingRequestDto request,
                        Authentication authentication) {

                return ResponseEntity.ok(
                                recheckingService.applyForRechecking(
                                                authentication.getName(),
                                                request));
        }

        @GetMapping("/my-requests")
        public ResponseEntity<ApiResponse<List<RecheckingResponse>>> getMyRecheckingRequests(
                        Authentication authentication) {

                return ResponseEntity.ok(
                                recheckingService.getMyRecheckingRequests(
                                                authentication.getName()));
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponse<Void>> cancelRechecking(
                        @PathVariable Long id,
                        Authentication authentication) {

                return ResponseEntity.ok(
                                recheckingService.cancelRechecking(
                                                authentication.getName(),
                                                id));
        }
}