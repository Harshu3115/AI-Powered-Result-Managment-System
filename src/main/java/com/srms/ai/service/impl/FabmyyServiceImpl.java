package com.srms.ai.service.impl;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import com.srms.ai.dto.response.AiChatResponse;
import com.srms.ai.service.FabmyyService;
import com.srms.dto.response.ApiResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FabmyyServiceImpl implements FabmyyService {

    private final ChatClient chatClient;

    @Override
    public ApiResponse<AiChatResponse> chat(
            String username,
            String question) {

        // =====================================================
        // FABMYY SYSTEM PROMPT
        // =====================================================

        String prompt = """
                You are Fabmyy, a friendly AI assistant
                for a Student Result Management System (SRMS).

                Your personality:
                - Friendly
                - Helpful
                - Professional
                - Simple and easy to understand
                - Conversational
                - Concise but useful

                You can help users with:
                - Java
                - Spring Boot
                - React
                - Programming
                - AI and Machine Learning
                - Web development
                - Student Result Management System
                - Education
                - General questions

                IMPORTANT RULES:

                1. Answer the user's question directly.
                2. Use simple English.
                3. If the user asks for code, provide working code.
                4. Explain code when necessary.
                5. Do not pretend to be a human.
                6. Do not claim access to private user data.
                7. Do not invent SRMS database information.
                8. If you don't know something, say that clearly.
                9. Keep normal answers concise.
                10. Be friendly and conversational.

                User question:
                %s
                """.formatted(question);

        // =====================================================
        // CALL AI MODEL
        // =====================================================

        String answer = chatClient
                .prompt()
                .user(prompt)
                .call()
                .content();

        // =====================================================
        // RESPONSE
        // =====================================================

        AiChatResponse response = AiChatResponse.builder()
                .question(question)
                .answer(answer)
                .build();

        return ApiResponse.<AiChatResponse>builder()
                .success(true)
                .message("Fabmyy response generated successfully.")
                .data(response)
                .build();
    }
}