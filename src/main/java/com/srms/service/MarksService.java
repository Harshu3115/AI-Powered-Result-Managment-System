package com.srms.service;

import java.util.List;

import com.srms.dto.request.MarksRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.MarksResponse;

public interface MarksService {

    ApiResponse<MarksResponse> addMarks(MarksRequest request);

    ApiResponse<List<MarksResponse>> getAllMarks();

    ApiResponse<MarksResponse> getMarksById(Long id);

    ApiResponse<List<MarksResponse>> getMarksByStudent(Long studentId);

    ApiResponse<MarksResponse> updateMarks(Long id,
            MarksRequest request);

    ApiResponse<String> deleteMarks(Long id);

    ApiResponse<List<MarksResponse>> getMarksByTeacher();

    ApiResponse<List<MarksResponse>> addBulkMarks(List<MarksRequest> requests);

}