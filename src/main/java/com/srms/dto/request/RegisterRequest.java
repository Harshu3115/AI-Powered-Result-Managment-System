package com.srms.dto.request;

import java.time.LocalDate;

import com.srms.enums.Gender;
import com.srms.enums.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterRequest {

    // =========================
    // USER ACCOUNT
    // =========================

    @NotBlank(message = "Username is required")
    private String username;

    @Email(message = "Invalid email")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotNull(message = "Role is required")
    private Role role;

    // =========================
    // STUDENT DETAILS
    // =========================

    private String rollNo;

    private String enrollmentNo;

    private Long prnNo;

    private String firstName;

    private String lastName;

    private String mobile;

    private Gender gender;

    private LocalDate dateOfBirth;

    private Integer admissionYear;

    // =========================
    // TEACHER DETAILS
    // =========================

    private String teacherCode;

    private String qualification;

    private String designation;

    private Integer experience;

    private Long departmentId;
}