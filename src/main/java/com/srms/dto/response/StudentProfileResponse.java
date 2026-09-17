package com.srms.dto.response;

import java.time.LocalDate;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfileResponse {

    private Long studentId;

    private Long prnNo;

    private String rollNo;

    private String firstName;

    private String lastName;

    private String email;

    private String mobile;

    private String gender;

    private LocalDate dateOfBirth;

    private String courseName;

    private String departmentName;

    private String semesterName;
}