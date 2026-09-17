package com.srms.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentRequest {

    @NotBlank(message = "Department Code is required")
    private String departmentCode;

    @NotBlank(message = "Department Name is required")
    private String departmentName;

    private String description;
}