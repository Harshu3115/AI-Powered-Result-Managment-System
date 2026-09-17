package com.srms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.RecheckingResponse;
import com.srms.service.RecheckingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/rechecking")
@RequiredArgsConstructor
public class AdminRecheckingController {

    private final RecheckingService recheckingService;

    // =====================================================
    // GET ALL RECHECKING REQUESTS
    // =====================================================

    @GetMapping
    public ResponseEntity<ApiResponse<List<RecheckingResponse>>> getAllRecheckingRequests() {

        return ResponseEntity.ok(
                recheckingService.getAllRecheckingRequests());
    }

    // =====================================================
    // GET REQUEST BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RecheckingResponse>> getRecheckingRequestById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                recheckingService.getRecheckingRequestById(id));
    }
}