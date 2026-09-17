package com.srms.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherProfileUpdateRequest {

    @NotBlank(message = "First name is required")
    @Size(max = 100, message = "First name cannot exceed 100 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 100, message = "Last name cannot exceed 100 characters")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Please enter a valid email")
    private String email;

    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must contain exactly 10 digits")
    private String mobile;

    @Size(max = 100, message = "Qualification cannot exceed 100 characters")
    private String qualification;

    @Size(max = 100, message = "Designation cannot exceed 100 characters")
    private String designation;

    @Size(max = 500, message = "Profile description cannot exceed 500 characters")
    private String profileDescription;
}