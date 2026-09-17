package com.srms.ai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.srms.ai.dto.request.TeacherAiChatRequest;
import com.srms.ai.dto.response.AiChatResponse;
import com.srms.ai.service.AiService;
import com.srms.dto.response.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/teacher/ai")
@RequiredArgsConstructor
public class TeacherAiController {

    private final AiService aiService;

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<AiChatResponse>> chat(
            @Valid @RequestBody TeacherAiChatRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                aiService.teacherChat(
                        authentication.getName(),
                        request.getQuestion()));
    }

    @PostMapping("/insights")
    public ResponseEntity<ApiResponse<AiChatResponse>> insights(
            @Valid @RequestBody TeacherAiChatRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                aiService.teacherInsights(
                        authentication.getName(),
                        request.getQuestion()));
    }
}