package com.srms.ai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.srms.ai.dto.request.FabmyyChatRequest;
import com.srms.ai.dto.response.AiChatResponse;
import com.srms.ai.service.FabmyyService;
import com.srms.dto.response.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/fabmyy")
@RequiredArgsConstructor
public class FabmyyController {

    private final FabmyyService fabmyyService;

    // =====================================================
    // FABMYY CHAT
    // =====================================================

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<AiChatResponse>> chat(

            @Valid @RequestBody FabmyyChatRequest request,

            Authentication authentication) {

        String username = null;

        // =================================================
        // USER MAY BE LOGGED IN OR GUEST
        // =================================================

        if (authentication != null) {
            username = authentication.getName();
        }

        return ResponseEntity.ok(
                fabmyyService.chat(
                        username,
                        request.getQuestion()));
    }
}