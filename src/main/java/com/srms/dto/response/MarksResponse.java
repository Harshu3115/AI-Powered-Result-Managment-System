package com.srms.dto.response;

import com.srms.enums.DBATUGrade;
import com.srms.enums.ResultStatus;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarksResponse {

    private Long id;

    private Long studentId;
    private String studentName;
    private String rollNo;

    private Long subjectId;
    private String subjectCode;
    private String subjectName;

    private Long teacherId;
    private String teacherName;

    private Integer internalMarks;
    private Integer externalMarks;
    private Integer totalMarks;

    private DBATUGrade grade;

    private ResultStatus resultStatus;
}