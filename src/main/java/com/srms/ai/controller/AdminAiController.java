package com.srms.ai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.srms.ai.dto.request.AdminAiAnalyticsRequest;
import com.srms.ai.dto.response.AiChatResponse;
import com.srms.ai.service.AiService;
import com.srms.dto.response.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/ai")
@RequiredArgsConstructor
public class AdminAiController {

    private final AiService aiService;

    @PostMapping("/analytics")
    public ResponseEntity<ApiResponse<AiChatResponse>> analytics(
            @Valid @RequestBody AdminAiAnalyticsRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                aiService.adminAnalytics(
                        authentication.getName(),
                        request.getQuestion()));
    }
}