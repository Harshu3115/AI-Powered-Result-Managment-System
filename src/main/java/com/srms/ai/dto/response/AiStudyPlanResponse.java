package com.srms.ai.dto.response;

import java.util.List;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiStudyPlanResponse {

    private String overallAdvice;

    private List<StudyPlanItem> studyPlan;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StudyPlanItem {

        private String subject;

        private String priority;

        private List<String> topics;

        private Integer recommendedHours;

        private String reason;
    }
}