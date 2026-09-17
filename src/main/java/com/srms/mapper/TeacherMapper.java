package com.srms.mapper;

import org.springframework.stereotype.Component;

import com.srms.dto.response.TeacherResponse;
import com.srms.entity.Teacher;

@Component
public class TeacherMapper {

    public TeacherResponse toResponse(Teacher teacher) {

        return TeacherResponse.builder()

                // ==============================
                // TEACHER
                // ==============================

                .id(teacher.getId())

                .teacherCode(
                        teacher.getTeacherCode())

                .firstName(
                        teacher.getFirstName())

                .lastName(
                        teacher.getLastName())

                .email(
                        teacher.getEmail())

                .mobile(
                        teacher.getMobile())

                .gender(
                        teacher.getGender())

                .qualification(
                        teacher.getQualification())

                .designation(
                        teacher.getDesignation())

                .experience(
                        teacher.getExperience())

                .profileImage(
                        teacher.getProfileImage())

                // ==============================
                // DEPARTMENT
                // ==============================

                .departmentId(
                        teacher.getDepartment() != null
                                ? teacher.getDepartment().getId()
                                : null)

                .departmentName(
                        teacher.getDepartment() != null
                                ? teacher.getDepartment().getDepartmentName()
                                : null)

                // ==============================
                // USER
                // ==============================

                .userId(
                        teacher.getUser() != null
                                ? teacher.getUser().getId()
                                : null)

                .username(
                        teacher.getUser() != null
                                ? teacher.getUser().getUsername()
                                : null)

                .build();
    }
}