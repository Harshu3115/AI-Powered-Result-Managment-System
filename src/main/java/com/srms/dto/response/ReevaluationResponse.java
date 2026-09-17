package com.srms.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReevaluationResponse {

    private Long id;

    // =========================================================
    // STUDENT DETAILS
    // =========================================================

    private Long studentId;

    private String studentName;

    private String rollNo;

    private Long prnNo;

    private String email;

    private String mobile;

    // =========================================================
    // ACADEMIC DETAILS
    // =========================================================

    private String departmentName;

    private String semesterName;

    private String examType;

    // =========================================================
    // REQUEST DETAILS
    // =========================================================

    private String reason;

    private String status;

    private LocalDateTime appliedAt;

    private LocalDateTime reviewedAt;

    // =========================================================
    // SUBJECTS
    // =========================================================

    private List<ReevaluationSubjectResponse> subjects;
}