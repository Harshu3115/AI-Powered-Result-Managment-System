package com.srms.dto.request;

import java.time.LocalDate;

import com.srms.enums.Gender;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfileRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Please enter a valid email address")
    private String email;

    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must contain exactly 10 digits")
    private String mobile;

    private Gender gender;

    private LocalDate dateOfBirth;
}