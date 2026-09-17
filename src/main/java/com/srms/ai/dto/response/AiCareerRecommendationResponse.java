package com.srms.ai.dto.response;

import java.util.List;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiCareerRecommendationResponse {

    private String careerSummary;

    private List<CareerRecommendation> careers;

    private List<String> skillRecommendations;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CareerRecommendation {

        private String career;

        private String suitability;

        private String reason;

        private List<String> relevantSubjects;

        private List<String> recommendedSkills;
    }
}