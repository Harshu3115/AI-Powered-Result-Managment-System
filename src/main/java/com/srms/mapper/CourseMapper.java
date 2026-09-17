package com.srms.mapper;

import org.springframework.stereotype.Component;

import com.srms.dto.response.CourseResponse;
import com.srms.entity.Course;

@Component
public class CourseMapper {

    public CourseResponse toResponse(Course course) {

        return CourseResponse.builder()
                .id(course.getId())
                .courseCode(course.getCourseCode())
                .courseName(course.getCourseName())
                .duration(course.getDuration())
                .description(course.getDescription())
                .departmentId(course.getDepartment().getId())
                .departmentName(course.getDepartment().getDepartmentName())
                .build();
    }

}