package com.srms.ai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.srms.ai.dto.response.TeacherAiStatisticsResponse;
import com.srms.ai.service.TeacherAiStatisticsService;
import com.srms.dto.response.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/teacher/ai")
@RequiredArgsConstructor
public class TeacherAiStatisticsController {

    private final TeacherAiStatisticsService teacherAiStatisticsService;

    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<TeacherAiStatisticsResponse>> getStatistics(
            Authentication authentication) {

        TeacherAiStatisticsResponse statistics = teacherAiStatisticsService
                .generateStatistics(
                        authentication.getName());

        return ResponseEntity.ok(
                ApiResponse.<TeacherAiStatisticsResponse>builder()
                        .success(true)
                        .message("Teacher AI Statistics")
                        .data(statistics)
                        .build());
    }
}