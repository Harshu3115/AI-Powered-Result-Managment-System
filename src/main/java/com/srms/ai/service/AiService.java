package com.srms.ai.service;

import java.util.List;

import com.srms.ai.dto.response.AiAnalysisResponse;
import com.srms.ai.dto.response.AiCareerRecommendationResponse;
import com.srms.ai.dto.response.AiChatResponse;
import com.srms.ai.dto.response.AiStudyPlanResponse;
import com.srms.ai.dto.response.AiSubjectAnalysisResponse;
import com.srms.dto.response.ApiResponse;

public interface AiService {

    ApiResponse<AiAnalysisResponse> analyzeStudentPerformance(
            String username);

    ApiResponse<List<AiSubjectAnalysisResponse>> analyzeSubjects(
            String username);

    ApiResponse<AiStudyPlanResponse> generateStudyPlan(
            String username);

    ApiResponse<AiCareerRecommendationResponse> recommendCareer(
            String username);

    ApiResponse<AiChatResponse> chat(
            String username,
            String question);

    ApiResponse<AiChatResponse> adminAnalytics(
            String username,
            String question);

    ApiResponse<AiChatResponse> teacherChat(
            String username,
            String question);

    ApiResponse<AiChatResponse> teacherInsights(
            String username,
            String question);
}