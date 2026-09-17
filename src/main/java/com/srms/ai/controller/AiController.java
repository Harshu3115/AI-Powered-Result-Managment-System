package com.srms.ai.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.srms.ai.dto.request.AiChatRequest;
import com.srms.ai.dto.response.AiAnalysisResponse;
import com.srms.ai.dto.response.AiCareerRecommendationResponse;
import com.srms.ai.dto.response.AiChatResponse;
import com.srms.ai.dto.response.AiStudyPlanResponse;
import com.srms.ai.dto.response.AiSubjectAnalysisResponse;
import com.srms.ai.service.AiService;
import com.srms.dto.response.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/student/ai")
@RequiredArgsConstructor
public class AiController {

        private final AiService aiService;

        // ==========================================
        // STUDENT AI
        // ==========================================

        @GetMapping("/performance-analysis")
        public ResponseEntity<ApiResponse<AiAnalysisResponse>> analyzePerformance(
                        Authentication authentication) {

                return ResponseEntity.ok(
                                aiService.analyzeStudentPerformance(
                                                authentication.getName()));
        }

        @GetMapping("/test")
        public String test() {
                return "Student AI Controller is working";
        }

        @GetMapping("/subjects")
        public ResponseEntity<ApiResponse<List<AiSubjectAnalysisResponse>>> analyzeSubjects(
                        Authentication authentication) {

                return ResponseEntity.ok(
                                aiService.analyzeSubjects(
                                                authentication.getName()));
        }

        @GetMapping("/study-plan")
        public ResponseEntity<ApiResponse<AiStudyPlanResponse>> generateStudyPlan(
                        Authentication authentication) {

                return ResponseEntity.ok(
                                aiService.generateStudyPlan(
                                                authentication.getName()));
        }

        @GetMapping("/career")
        public ResponseEntity<ApiResponse<AiCareerRecommendationResponse>> recommendCareer(
                        Authentication authentication) {

                return ResponseEntity.ok(
                                aiService.recommendCareer(
                                                authentication.getName()));
        }

        @PostMapping("/chat")
        public ResponseEntity<ApiResponse<AiChatResponse>> chat(
                        @Valid @RequestBody AiChatRequest request,
                        Authentication authentication) {

                return ResponseEntity.ok(
                                aiService.chat(
                                                authentication.getName(),
                                                request.getQuestion()));
        }

        // ==========================================
        // ADMIN AI
        // ==========================================

        @PostMapping("/admin/chat")
        public ResponseEntity<ApiResponse<AiChatResponse>> adminChat(
                        @Valid @RequestBody AiChatRequest request,
                        Authentication authentication) {

                return ResponseEntity.ok(
                                aiService.adminAnalytics(
                                                authentication.getName(),
                                                request.getQuestion()));
        }
}