package com.srms.mapper;

import org.springframework.stereotype.Component;

import com.srms.dto.response.SubjectResponse;
import com.srms.entity.Subject;

@Component
public class SubjectMapper {

    public SubjectResponse toResponse(Subject subject) {

    	return SubjectResponse.builder()
    	        .id(subject.getId())
    	        .subjectCode(subject.getSubjectCode())
    	        .subjectName(subject.getSubjectName())
    	        .credits(subject.getCredits())
    	        .internalMaxMarks(subject.getInternalMaxMarks())
    	        .externalMaxMarks(subject.getExternalMaxMarks())
    	        .passingMarks(subject.getPassingMarks())
    	        .subjectType(subject.getSubjectType())

    	        .semesterId(subject.getSemester().getId())
    	        .semesterName(subject.getSemester().getSemesterName())

    	        .courseId(subject.getSemester().getCourse().getId())
    	        .courseName(subject.getSemester().getCourse().getCourseName())

    	        .departmentId(subject.getSemester().getCourse().getDepartment().getId())
    	        .departmentName(subject.getSemester().getCourse().getDepartment().getDepartmentName())

    	        .build();
    }
}