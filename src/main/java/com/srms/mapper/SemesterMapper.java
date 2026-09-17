package com.srms.mapper;

import org.springframework.stereotype.Component;

import com.srms.dto.response.SemesterResponse;
import com.srms.entity.Semester;

@Component
public class SemesterMapper {

    public SemesterResponse toResponse(Semester semester) {

        return SemesterResponse.builder()
                .id(semester.getId())
                .semesterNumber(semester.getSemesterNumber())
                .semesterName(semester.getSemesterName())

                .courseId(semester.getCourse().getId())
                .courseName(semester.getCourse().getCourseName())

                .departmentId(semester.getCourse().getDepartment().getId())
                .departmentName(
                        semester.getCourse()
                                .getDepartment()
                                .getDepartmentName())
                .examMode(semester.getExamMode())
                .build();
    }

}