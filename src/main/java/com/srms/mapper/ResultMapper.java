package com.srms.mapper;

import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.srms.dto.response.ResultResponse;
import com.srms.dto.response.ResultSubjectResponse;
import com.srms.entity.Result;

@Component
public class ResultMapper {

        public ResultResponse toResponse(Result result) {

                return ResultResponse.builder()

                                .id(result.getId())

                                .studentId(
                                                result.getStudent().getId())

                                .studentName(
                                                result.getStudent().getFirstName()
                                                                + " "
                                                                + result.getStudent().getLastName())

                                .rollNo(
                                                result.getStudent().getRollNo())

                                .semesterId(
                                                result.getSemester().getId())

                                .semesterName(
                                                result.getSemester().getSemesterName())

                                .courseId(
                                                result.getSemester()
                                                                .getCourse()
                                                                .getId())

                                .courseName(
                                                result.getSemester()
                                                                .getCourse()
                                                                .getCourseName())

                                .departmentId(
                                                result.getSemester()
                                                                .getCourse()
                                                                .getDepartment()
                                                                .getId())

                                .departmentName(
                                                result.getSemester()
                                                                .getCourse()
                                                                .getDepartment()
                                                                .getDepartmentName())

                                .totalMarks(
                                                result.getTotalMarks())

                                .obtainedMarks(
                                                result.getObtainedMarks())

                                .percentage(
                                                result.getPercentage())

                                .sgpa(
                                                result.getSgpa())

                                .cgpaPercentage(result.getCgpaPercentage())

                                .resultStatus(
                                                result.getResultStatus())

                                // Result-level exam mode
                                .examMode(
                                                result.getExamMode())

                                .subjects(
                                                result.getResultSubjects()
                                                                .stream()
                                                                .map(rs -> ResultSubjectResponse.builder()

                                                                                // ResultSubject table ID
                                                                                .resultSubjectId(
                                                                                                rs.getId())

                                                                                // Subject table ID
                                                                                .subjectId(
                                                                                                rs.getSubject().getId())

                                                                                .subjectCode(
                                                                                                rs.getSubject().getSubjectCode())

                                                                                .subjectName(
                                                                                                rs.getSubject().getSubjectName())

                                                                                .credits(
                                                                                                rs.getCredits())

                                                                                .totalMarks(
                                                                                                rs.getTotalMarks())

                                                                                .obtainedMarks(
                                                                                                rs.getObtainedMarks())

                                                                                .percentage(
                                                                                                rs.getPercentage())

                                                                                // DBATUGrade -> String
                                                                                .grade(
                                                                                                rs.getGrade() != null
                                                                                                                ? rs.getGrade().name()
                                                                                                                : null)

                                                                                .gradePoint(
                                                                                                rs.getGradePoint())

                                                                                .build())
                                                                .collect(Collectors.toList()))

                                .build();
        }
}