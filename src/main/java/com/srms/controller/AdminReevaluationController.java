package com.srms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.ReevaluationResponse;
import com.srms.service.ReevaluationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/reevaluation")
@RequiredArgsConstructor
public class AdminReevaluationController {

    private final ReevaluationService reevaluationService;

    // =========================================================
    // ADMIN - GET ALL REEVALUATION REQUESTS
    // =========================================================

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReevaluationResponse>>> getAllRequests() {

        return ResponseEntity.ok(
                reevaluationService.getAllReevaluationRequests());
    }

    // =========================================================
    // ADMIN - GET REQUEST BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReevaluationResponse>> getRequestById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                reevaluationService.getReevaluationRequestById(id));
    }
}