package com.srms.ai.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiSubjectAnalysisResponse {

    private Long subjectId;

    private String subjectCode;

    private String subjectName;

    private Integer marks;

    private String grade;

    private Double gradePoint;

    private String riskLevel;

    private String analysis;

    private String recommendation;
}