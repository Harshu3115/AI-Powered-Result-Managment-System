package com.srms.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.srms.dto.request.TeacherRequest;
import com.srms.dto.request.TeacherResultRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.AssignedSubjectResponse;
import com.srms.dto.response.PageResponse;
import com.srms.dto.response.SubjectPerformanceResponse;
import com.srms.dto.response.TeacherDashboardResponse;
import com.srms.dto.response.TeacherRecheckingResponse;
import com.srms.dto.response.TeacherResponse;
import com.srms.dto.response.TeacherResultResponse;
import com.srms.dto.response.TeacherStudentResponse;

public interface TeacherService {

        ApiResponse<TeacherResponse> addTeacher(TeacherRequest request);

        ApiResponse<PageResponse<TeacherResponse>> getAllTeachers(
                        int page,
                        int size);

        ApiResponse<TeacherResponse> getTeacherById(Long id);

        ApiResponse<TeacherResponse> updateTeacher(Long id,
                        TeacherRequest request);

        ApiResponse<String> deleteTeacher(Long id);

        ApiResponse<TeacherDashboardResponse> getTeacherDashboard(
                        String username);

        ApiResponse<List<AssignedSubjectResponse>> getAssignedSubjects(
                        String username);

        ApiResponse<List<TeacherStudentResponse>> getStudents(
                        String username);

        ApiResponse<List<SubjectPerformanceResponse>> getSubjectPerformance(
                        String email);

        ApiResponse<List<TeacherResultResponse>> getResults(
                        String username);

        ApiResponse<String> saveResults(
                        String email,
                        List<TeacherResultRequest> requests);

        ApiResponse<List<TeacherRecheckingResponse>> getRecheckingRequests(String username);

        ApiResponse<TeacherRecheckingResponse> approveRechecking(
                        String username,
                        Long recheckingSubjectId,
                        Integer newMarks);

        ApiResponse<String> rejectRechecking(
                        String username,
                        Long recheckingSubjectId);

        ApiResponse<TeacherResponse> getTeacherProfile(String username);

        ApiResponse<TeacherResponse> updateProfile(
                        String username,
                        String firstName,
                        String lastName,
                        String email,
                        String mobile,
                        String department,
                        String qualification,
                        String designation,
                        String experience,
                        MultipartFile profileImage);
}