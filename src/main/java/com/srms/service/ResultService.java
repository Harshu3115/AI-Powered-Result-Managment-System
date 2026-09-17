package com.srms.service;

import java.util.List;

import com.srms.dto.request.ResultRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.CGPAResponse;
import com.srms.dto.response.ResultResponse;
import com.srms.dto.response.StudentDashboardResponse;

public interface ResultService {

        ApiResponse<ResultResponse> generateResult(ResultRequest request);

        ApiResponse<ResultResponse> getResultById(Long id);

        ApiResponse<ResultResponse> getStudentSemesterResult(
                        Long studentId,
                        Long semesterId);

        ApiResponse<List<ResultResponse>> getStudentResults(
                        Long studentId);

        ApiResponse<List<ResultResponse>> getAllResults();

        ApiResponse<String> deleteResult(Long id);

        ApiResponse<CGPAResponse> getStudentCGPA(Long studentId);

        ApiResponse<List<ResultResponse>> getStudentResultsByUsername(
                        String username);

        ApiResponse<ResultResponse> getMySemesterResult(
                        String username,
                        Long semesterId);

        ApiResponse<CGPAResponse> getStudentCGPAByUsername(
                        String username);

        ApiResponse<StudentDashboardResponse> getStudentDashboard(
                        String username);

        void recalculateResult(Long resultId);

        byte[] generateMarksheet(Long resultId);

        ApiResponse<CGPAResponse> getMyCGPA(String username);

}