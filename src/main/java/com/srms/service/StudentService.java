package com.srms.service;

import java.util.List;

import com.srms.dto.request.ChangePasswordRequest;
import com.srms.dto.request.StudentProfileRequest;
import com.srms.dto.request.StudentRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.StudentProfileResponse;
import com.srms.dto.response.StudentResponse;

public interface StudentService {

    ApiResponse<StudentResponse> addStudent(StudentRequest request);

    ApiResponse<List<StudentResponse>> getAllStudents();

    ApiResponse<StudentResponse> getStudentById(Long id);

    ApiResponse<StudentResponse> updateStudent(Long id,
            StudentRequest request);

    ApiResponse<String> deleteStudent(Long id);

    ApiResponse<StudentProfileResponse> getMyProfile(
            String username);

    ApiResponse<StudentProfileResponse> updateMyProfile(
            String username,
            StudentProfileRequest request);

    ApiResponse<String> changePassword(
            String username,
            ChangePasswordRequest request);

}