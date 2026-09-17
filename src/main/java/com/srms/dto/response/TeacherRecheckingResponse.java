package com.srms.dto.response;

import java.time.LocalDateTime;

import com.srms.enums.ExamType;
import com.srms.enums.RecheckingResult;
import com.srms.enums.RecheckingStatus;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherRecheckingResponse {

    private Long recheckingSubjectId;

    private Long recheckingRequestId;

    // Student details
    private Long studentId;
    private Long prnNo;
    private String rollNo;
    private String studentName;

    // Exam details
    private ExamType examType;
    private String semesterName;

    // Subject details
    private Long subjectId;
    private String subjectCode;
    private String subjectName;

    // Marks
    private Integer oldMarks;
    private Integer newMarks;

    // Request information
    private String reason;

    // Status
    private RecheckingStatus status;
    private RecheckingResult reviewResult;

    private LocalDateTime appliedAt;
    private LocalDateTime reviewedAt;
}