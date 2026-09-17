package com.srms.service;

import java.util.List;

import com.srms.dto.request.CourseRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.CourseResponse;

public interface CourseService {

    ApiResponse<CourseResponse> addCourse(CourseRequest request);

    ApiResponse<List<CourseResponse>> getAllCourses();

    ApiResponse<CourseResponse> getCourseById(Long id);

    ApiResponse<CourseResponse> updateCourse(Long id, CourseRequest request);

    ApiResponse<String> deleteCourse(Long id);

}