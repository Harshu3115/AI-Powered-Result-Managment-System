package com.srms.dto.response;

import java.time.LocalDate;

import com.srms.enums.Gender;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentResponse {

    private Long id;

    private String rollNo;

    private String enrollmentNo;

    private Long prnNo;

    private String firstName;

    private String lastName;

    private String email;

    private String username;

    private String mobile;

    private Gender gender;

    private LocalDate dateOfBirth;

    private Integer admissionYear;

    private Long semesterId;

    private String semesterName;

    private Long courseId;

    private String courseName;

    private Long departmentId;

    private String departmentName;
}