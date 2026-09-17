package com.srms.dto.response;

import java.time.LocalDateTime;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReevaluationSubjectResponse {

    private Long id;

    private Long resultSubjectId;

    private String subjectCode;

    private String subjectName;

    private Long teacherId;

    private String teacherName;

    // Marks before reevaluation
    private Integer oldMarks;

    // Marks after reevaluation
    private Integer newMarks;

    private String status;

    private String reviewResult;

    private LocalDateTime reviewedAt;
}