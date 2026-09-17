package com.srms.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecheckingResponse {

    private Long id;

    // Student details
    private Long studentId;
    private String studentName;
    private String rollNo;
    private Long prnNo;
    private String email;
    private String mobile;

    // Academic details
    private String departmentName;
    private String semesterName;
    private String examType;

    // Request details
    private String reason;
    private String status;

    private LocalDateTime appliedAt;
    private LocalDateTime reviewedAt;

    // Multiple subjects
    private List<RecheckingSubjectResponse> subjects;
}