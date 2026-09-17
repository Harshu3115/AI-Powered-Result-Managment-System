package com.srms.service;

import java.util.List;

import com.srms.dto.request.SubjectRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.SubjectResponse;

public interface SubjectService {

    ApiResponse<SubjectResponse> addSubject(SubjectRequest request);

    ApiResponse<List<SubjectResponse>> getAllSubjects();

    ApiResponse<SubjectResponse> getSubjectById(Long id);

    ApiResponse<SubjectResponse> updateSubject(Long id, SubjectRequest request);

    ApiResponse<String> deleteSubject(Long id);

}