package com.srms.mapper;

import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.srms.dto.response.ReevaluationResponse;
import com.srms.dto.response.ReevaluationSubjectResponse;
import com.srms.entity.ReevaluationRequest;
import com.srms.entity.ReevaluationSubject;

@Component
public class ReevaluationMapper {

        public ReevaluationResponse toResponse(
                        ReevaluationRequest request) {

                return ReevaluationResponse.builder()

                                // Request
                                .id(request.getId())

                                // Student
                                .studentId(
                                                request.getStudent().getId())

                                .studentName(
                                                request.getStudent().getFirstName()
                                                                + " "
                                                                + request.getStudent().getLastName())

                                .rollNo(
                                                request.getStudent().getRollNo())

                                .prnNo(
                                                request.getStudent().getPrnNo())

                                .email(
                                                request.getStudent().getEmail())

                                .mobile(
                                                request.getStudent().getMobile())

                                // Academic details
                                .departmentName(
                                                request.getSubjects()
                                                                .isEmpty()
                                                                                ? null
                                                                                : request.getSubjects()
                                                                                                .get(0)
                                                                                                .getResultSubject()
                                                                                                .getResult()
                                                                                                .getSemester()
                                                                                                .getCourse()
                                                                                                .getDepartment()
                                                                                                .getDepartmentName())

                                .semesterName(
                                                request.getSubjects()
                                                                .isEmpty()
                                                                                ? null
                                                                                : request.getSubjects()
                                                                                                .get(0)
                                                                                                .getResultSubject()
                                                                                                .getResult()
                                                                                                .getSemester()
                                                                                                .getSemesterName())

                                .examType(
                                                request.getExamType() != null
                                                                ? request.getExamType().name()
                                                                : null)

                                // Request details
                                .reason(request.getReason())

                                .status(
                                                request.getStatus() != null
                                                                ? request.getStatus().name()
                                                                : null)

                                .appliedAt(request.getAppliedAt())

                                .reviewedAt(request.getReviewedAt())

                                // Subjects
                                .subjects(
                                                request.getSubjects()
                                                                .stream()
                                                                .map(this::toSubjectResponse)
                                                                .collect(Collectors.toList()))

                                .build();
        }

        private ReevaluationSubjectResponse toSubjectResponse(
                        ReevaluationSubject subject) {

                return ReevaluationSubjectResponse.builder()

                                .id(subject.getId())

                                .resultSubjectId(
                                                subject.getResultSubject().getId())

                                .subjectCode(
                                                subject.getResultSubject()
                                                                .getSubject()
                                                                .getSubjectCode())

                                .subjectName(
                                                subject.getResultSubject()
                                                                .getSubject()
                                                                .getSubjectName())

                                .teacherId(
                                                subject.getTeacher() != null
                                                                ? subject.getTeacher().getId()
                                                                : null)

                                .teacherName(
                                                subject.getTeacher() != null
                                                                ? subject.getTeacher().getFirstName()
                                                                                + " "
                                                                                + subject.getTeacher().getLastName()
                                                                : null)

                                .oldMarks(
                                                subject.getOldMarks())

                                .newMarks(
                                                subject.getNewMarks())

                                .status(
                                                subject.getStatus() != null
                                                                ? subject.getStatus().name()
                                                                : null)

                                .reviewResult(
                                                subject.getReviewResult() != null
                                                                ? subject.getReviewResult().name()
                                                                : null)

                                .reviewedAt(
                                                subject.getReviewedAt())

                                .build();
        }
}