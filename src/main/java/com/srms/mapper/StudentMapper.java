package com.srms.mapper;

import org.springframework.stereotype.Component;

import com.srms.dto.response.StudentResponse;
import com.srms.entity.Student;

@Component
public class StudentMapper {

    public StudentResponse toResponse(Student student) {

        return StudentResponse.builder()
                .id(student.getId())
                .rollNo(student.getRollNo())
                .enrollmentNo(student.getEnrollmentNo())
                .prnNo(student.getPrnNo())
                .firstName(student.getFirstName())
                .lastName(student.getLastName())
                .email(student.getEmail())
                .username(student.getUser().getUsername())
                .mobile(student.getMobile())
                .gender(student.getGender())
                .dateOfBirth(student.getDateOfBirth())
                .admissionYear(student.getAdmissionYear())

                .semesterId(student.getSemester().getId())
                .semesterName(student.getSemester().getSemesterName())

                .courseId(student.getSemester().getCourse().getId())
                .courseName(student.getSemester().getCourse().getCourseName())

                .departmentId(student.getSemester().getCourse().getDepartment().getId())
                .departmentName(student.getSemester().getCourse().getDepartment().getDepartmentName())

                .build();
    }
}