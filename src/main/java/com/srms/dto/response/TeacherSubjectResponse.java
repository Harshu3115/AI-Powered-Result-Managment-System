package com.srms.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherSubjectResponse {

    private Long id;

    // =====================================================
    // TEACHER
    // =====================================================

    private Long teacherId;

    private String teacherName;

    private String teacherCode;

    private String teacherEmail;

    // =====================================================
    // SUBJECT
    // =====================================================

    private Long subjectId;

    private String subjectCode;

    private String subjectName;

    private Integer credits;

    // =====================================================
    // DEPARTMENT
    // =====================================================

    private Long departmentId;

    private String departmentName;

    // =====================================================
    // SEMESTER
    // =====================================================

    private Long semesterId;

    private String semesterName;
}