package com.srms.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecheckingSubjectResponse {

    private Long id;

    private Long resultSubjectId;

    // Student information
    private Long studentId;
    private String studentName;
    private String rollNo;
    private Long prnNo;
    private String enrollmentNo;
    private String semesterName;

    // Rechecking request information
    private String examType;
    private String reason;

    // Subject information
    private String subjectCode;
    private String subjectName;

    // Teacher information
    private Long teacherId;
    private String teacherName;

    // Marks
    private Integer oldMarks;
    private Integer newMarks;

    // Status
    private String status;
    private String reviewResult;
    private String teacherMessage;
}