package com.srms.mapper;

import org.springframework.stereotype.Component;

import com.srms.dto.response.TeacherSubjectResponse;
import com.srms.entity.Subject;
import com.srms.entity.Teacher;
import com.srms.entity.TeacherSubject;

@Component
public class TeacherSubjectMapper {

        public TeacherSubjectResponse toResponse(
                        TeacherSubject teacherSubject) {

                Teacher teacher = teacherSubject.getTeacher();

                Subject subject = teacherSubject.getSubject();

                // =====================================================
                // TEACHER NAME
                // =====================================================

                String teacherName = ((teacher.getFirstName() != null)
                                ? teacher.getFirstName()
                                : "")
                                + " "
                                + ((teacher.getLastName() != null)
                                                ? teacher.getLastName()
                                                : "");

                // =====================================================
                // TEACHER EMAIL
                // =====================================================

                String teacherEmail = null;

                if (teacher.getUser() != null) {

                        teacherEmail = teacher.getUser().getEmail();
                }

                // =====================================================
                // RESPONSE
                // =====================================================

                return TeacherSubjectResponse.builder()

                                .id(
                                                teacherSubject.getId())

                                // -------------------------
                                // Teacher
                                // -------------------------

                                .teacherId(
                                                teacher.getId())

                                .teacherName(
                                                teacherName.trim())

                                .teacherCode(
                                                teacher.getTeacherCode())

                                .teacherEmail(
                                                teacherEmail)

                                // -------------------------
                                // Subject
                                // -------------------------

                                .subjectId(
                                                subject.getId())

                                .subjectCode(
                                                subject.getSubjectCode())

                                .subjectName(
                                                subject.getSubjectName())

                                .credits(
                                                subject.getCredits())

                                // -------------------------
                                // Department
                                // -------------------------

                                .departmentId(null)

                                .departmentName(null)

                                // -------------------------
                                // Semester
                                // -------------------------

                                .semesterId(null)

                                .semesterName(null)

                                .build();
        }
}