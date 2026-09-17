package com.srms.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.srms.dto.response.ApiResponse;
import com.srms.service.AdminPerformanceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/performance")
@RequiredArgsConstructor
public class AdminPerformanceController {

    private final AdminPerformanceService adminPerformanceService;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPerformance() {

        return ResponseEntity.ok(
                adminPerformanceService.getPerformance());
    }
}