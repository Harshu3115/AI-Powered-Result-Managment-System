package com.srms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.srms.dto.response.AdminDashboardResponse;
import com.srms.dto.response.ApiResponse;
import com.srms.service.AdminDashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getDashboard() {

        return ResponseEntity.ok(
                ApiResponse.<AdminDashboardResponse>builder()
                        .success(true)
                        .message("Admin Dashboard")
                        .data(
                                adminDashboardService
                                        .getDashboard())
                        .build());
    }
}