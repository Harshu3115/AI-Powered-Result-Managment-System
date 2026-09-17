package com.srms.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseResponse {

    private Long id;

    private String courseCode;

    private String courseName;

    private Integer duration;

    private String description;

    private Long departmentId;

    private String departmentName;
}