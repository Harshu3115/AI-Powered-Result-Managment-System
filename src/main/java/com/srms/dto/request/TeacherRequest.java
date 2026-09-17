package com.srms.dto.request;

import com.srms.enums.Gender;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherRequest {

    @NotBlank(message = "Teacher Code is required")
    private String teacherCode;

    @NotBlank(message = "First Name is required")
    private String firstName;

    @NotBlank(message = "Last Name is required")
    private String lastName;

    @Email(message = "Invalid Email")
    @NotBlank(message = "Email is required")
    private String email;

    private String username;

    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be 10 digits")
    private String mobile;

    @NotNull(message = "Gender is required")
    private Gender gender;

    @NotBlank(message = "Qualification is required")
    private String qualification;

    @NotBlank(message = "Designation is required")
    private String designation;

    @NotNull(message = "Experience is required")
    @Min(0)
    @Max(50)
    private Integer experience;

    @NotNull(message = "Department is required")
    private Long departmentId;

}