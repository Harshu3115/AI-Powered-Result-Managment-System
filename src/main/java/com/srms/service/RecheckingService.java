package com.srms.service;

import java.util.List;

import com.srms.dto.request.RecheckingRequestDto;
import com.srms.dto.request.TeacherRecheckingCompleteRequest;
import com.srms.dto.request.TeacherRecheckingReviewRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.RecheckingResponse;
import com.srms.dto.response.RecheckingSubjectResponse;

public interface RecheckingService {

        ApiResponse<RecheckingResponse> applyForRechecking(
                        String username,
                        RecheckingRequestDto request);

        ApiResponse<List<RecheckingResponse>> getMyRecheckingRequests(
                        String username);

        ApiResponse<List<RecheckingSubjectResponse>> getTeacherRecheckingRequests(
                        String username);

        ApiResponse<RecheckingSubjectResponse> reviewRecheckingRequest(
                        String username,
                        Long recheckingSubjectId,
                        TeacherRecheckingReviewRequest request);

        ApiResponse<RecheckingSubjectResponse> completeRechecking(
                        String username,
                        Long recheckingSubjectId,
                        TeacherRecheckingCompleteRequest request);

        ApiResponse<Void> cancelRechecking(
                        String username,
                        Long id);

        ApiResponse<String> deleteRecheckingRequest(
                        String username,
                        Long id);

        // =====================================================
        // ADMIN
        // =====================================================

        ApiResponse<List<RecheckingResponse>> getAllRecheckingRequests();

        ApiResponse<RecheckingResponse> getRecheckingRequestById(
                        Long id);
}