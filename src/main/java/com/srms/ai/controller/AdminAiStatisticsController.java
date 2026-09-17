package com.srms.ai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.srms.ai.dto.response.AiStatisticsResponse;
import com.srms.ai.service.AiStatisticsService;
import com.srms.dto.response.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/ai")
@RequiredArgsConstructor
public class AdminAiStatisticsController {

    private final AiStatisticsService aiStatisticsService;

    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<AiStatisticsResponse>> getStatistics() {

        return ResponseEntity.ok(
                ApiResponse.<AiStatisticsResponse>builder()
                        .success(true)
                        .message("AI Academic Statistics")
                        .data(aiStatisticsService.generateStatistics())
                        .build());
    }
}