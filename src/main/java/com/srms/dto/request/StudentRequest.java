package com.srms.dto.request;

import java.time.LocalDate;

import com.srms.enums.Gender;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentRequest {

    @NotBlank
    private String rollNo;

    @NotBlank
    private String enrollmentNo;

    @NotNull(message = "PRN Number is required")
    private Long prnNo;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @Email
    private String email;

    @NotBlank
    private String username;

    private String password;

    @Pattern(regexp = "^[0-9]{10}$")
    private String mobile;

    @NotNull
    private Gender gender;

    @NotNull
    private LocalDate dateOfBirth;

    @NotNull
    private Integer admissionYear;

    @NotNull
    private Long semesterId;
}