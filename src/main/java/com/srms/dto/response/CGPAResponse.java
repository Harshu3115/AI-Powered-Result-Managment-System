package com.srms.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CGPAResponse {

    private Long studentId;

    private String studentName;

    private String rollNo;

    private Integer totalSemesters;

    private Double cgpa;

    // DBATU converted percentage
    private Double percentage;
}