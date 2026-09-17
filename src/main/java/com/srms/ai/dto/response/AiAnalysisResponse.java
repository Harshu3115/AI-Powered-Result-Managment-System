package com.srms.ai.dto.response;

import java.util.List;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiAnalysisResponse {

    private String overallSummary;

    private String performanceTrend;

    private List<String> strengths;

    private List<String> areasForImprovement;

    private List<String> recommendations;
}