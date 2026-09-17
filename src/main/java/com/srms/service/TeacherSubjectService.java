package com.srms.service;

import java.util.List;

import com.srms.dto.request.TeacherSubjectRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.TeacherSubjectResponse;

public interface TeacherSubjectService {

        ApiResponse<TeacherSubjectResponse> assignSubject(
                        TeacherSubjectRequest request);

        ApiResponse<List<TeacherSubjectResponse>> getAllAssignments();

        ApiResponse<List<TeacherSubjectResponse>> getSubjectsByTeacher(
                        Long teacherId);

        ApiResponse<String> deleteAssignment(
                        Long id);

        ApiResponse<TeacherSubjectResponse> updateAssignment(
                        Long id,
                        TeacherSubjectRequest request);
}