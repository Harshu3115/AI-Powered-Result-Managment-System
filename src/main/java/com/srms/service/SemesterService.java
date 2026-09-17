package com.srms.service;

import java.util.List;

import com.srms.dto.request.SemesterRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.SemesterResponse;

public interface SemesterService {

    ApiResponse<SemesterResponse> addSemester(SemesterRequest request);

    ApiResponse<List<SemesterResponse>> getAllSemesters();

    ApiResponse<SemesterResponse> getSemesterById(Long id);

    ApiResponse<SemesterResponse> updateSemester(Long id, SemesterRequest request);

    ApiResponse<String> deleteSemester(Long id);

}