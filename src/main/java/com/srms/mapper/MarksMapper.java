package com.srms.mapper;

import org.springframework.stereotype.Component;

import com.srms.dto.response.MarksResponse;
import com.srms.entity.Marks;

@Component
public class MarksMapper {

    public MarksResponse toResponse(Marks marks) {

        return MarksResponse.builder()
                .id(marks.getId())

                .studentId(marks.getStudent().getId())
                .studentName(
                        marks.getStudent().getFirstName()
                                + " "
                                + marks.getStudent().getLastName())
                .rollNo(marks.getStudent().getRollNo())

                .subjectId(marks.getSubject().getId())
                .subjectCode(marks.getSubject().getSubjectCode())
                .subjectName(marks.getSubject().getSubjectName())

                .teacherId(marks.getTeacher().getId())
                .teacherName(
                        marks.getTeacher().getFirstName()
                                + " "
                                + marks.getTeacher().getLastName())

                .internalMarks(marks.getInternalMarks())
                .externalMarks(marks.getExternalMarks())
                .totalMarks(marks.getTotalMarks())

                .grade(marks.getGrade())
                .resultStatus(marks.getResultStatus())

                .build();
    }
}