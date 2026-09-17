package com.srms.dto.response;

import com.srms.enums.Gender;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherResponse {

    private Long id;

    private String teacherCode;

    private String firstName;

    private String lastName;

    private String email;

    private String mobile;

    private Gender gender;

    private String qualification;

    private String designation;

    private Integer experience;

    private Long departmentId;

    private String departmentName;

    private Long userId;

    private String username;

    private String profileImage;

}