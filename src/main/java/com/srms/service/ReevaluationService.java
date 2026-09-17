package com.srms.service;

import java.util.List;

import com.srms.dto.request.ReevaluationRequestDto;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.ReevaluationResponse;
import com.srms.dto.response.ReevaluationSubjectResponse;

public interface ReevaluationService {

        // Student submits reevaluation request
        ApiResponse<ReevaluationResponse> applyForReevaluation(
                        String username,
                        ReevaluationRequestDto request);

        // Student views own reevaluation requests
        ApiResponse<List<ReevaluationResponse>> getMyReevaluationRequests(
                        String username);

        // Teacher views assigned reevaluation subjects
        ApiResponse<List<ReevaluationSubjectResponse>> getTeacherReevaluationRequests(
                        String username);

        // Teacher reviews reevaluation
        ApiResponse<ReevaluationSubjectResponse> reviewReevaluationRequest(
                        String username,
                        Long reevaluationSubjectId,
                        String reviewResult);

        // Teacher completes reevaluation with new marks
        ApiResponse<ReevaluationSubjectResponse> completeReevaluation(
                        String username,
                        Long reevaluationSubjectId,
                        Integer newMarks,
                        String reviewResult);

        // Student cancels within 10 minutes
        ApiResponse<Void> cancelReevaluation(
                        String username,
                        Long id);

        ApiResponse<Void> deleteReevaluationRequest(
                        String username,
                        Long reevaluationSubjectId);

        // =========================================================
        // ADMIN - GET ALL REEVALUATION REQUESTS
        // =========================================================

        ApiResponse<List<ReevaluationResponse>> getAllReevaluationRequests();

        // =========================================================
        // ADMIN - GET REEVALUATION REQUEST BY ID
        // =========================================================

        ApiResponse<ReevaluationResponse> getReevaluationRequestById(
                        Long id);
}
