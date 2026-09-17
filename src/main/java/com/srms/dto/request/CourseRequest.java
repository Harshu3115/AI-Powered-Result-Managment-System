package com.srms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseRequest {

    @NotBlank(message = "Course Code is required")
    private String courseCode;

    @NotBlank(message = "Course Name is required")
    private String courseName;

    @NotNull(message = "Duration is required")
    private Integer duration;

    private String description;

    @NotNull(message = "Department is required")
    private Long departmentId;
}