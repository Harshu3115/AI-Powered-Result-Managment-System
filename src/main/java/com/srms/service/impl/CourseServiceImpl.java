package com.srms.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.srms.dto.request.CourseRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.CourseResponse;
import com.srms.entity.Course;
import com.srms.entity.Department;
import com.srms.exception.BadRequestException;
import com.srms.exception.ResourceNotFoundException;
import com.srms.mapper.CourseMapper;
import com.srms.repository.CourseRepository;
import com.srms.repository.DepartmentRepository;
import com.srms.service.CourseService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final DepartmentRepository departmentRepository;
    private final CourseMapper courseMapper;

    @Override
    public ApiResponse<CourseResponse> addCourse(CourseRequest request) {

        if (courseRepository.existsByCourseCode(request.getCourseCode())) {
            throw new BadRequestException("Course Code already exists.");
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        Course course = Course.builder()
                .courseCode(request.getCourseCode())
                .courseName(request.getCourseName())
                .duration(request.getDuration())
                .description(request.getDescription())
                .department(department)
                .build();

        course = courseRepository.save(course);

        return ApiResponse.<CourseResponse>builder()
                .success(true)
                .message("Course Added Successfully")
                .data(courseMapper.toResponse(course))
                .build();
    }

    @Override
    public ApiResponse<List<CourseResponse>> getAllCourses() {

        List<CourseResponse> response = courseRepository.findAll()
                .stream()
                .map(courseMapper::toResponse)
                .collect(Collectors.toList());

        return ApiResponse.<List<CourseResponse>>builder()
                .success(true)
                .message("Course List")
                .data(response)
                .build();
    }

    @Override
    public ApiResponse<CourseResponse> getCourseById(Long id) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        return ApiResponse.<CourseResponse>builder()
                .success(true)
                .message("Course Found")
                .data(courseMapper.toResponse(course))
                .build();
    }

    @Override
    public ApiResponse<CourseResponse> updateCourse(Long id, CourseRequest request) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        course.setCourseCode(request.getCourseCode());
        course.setCourseName(request.getCourseName());
        course.setDuration(request.getDuration());
        course.setDescription(request.getDescription());
        course.setDepartment(department);

        course = courseRepository.save(course);

        return ApiResponse.<CourseResponse>builder()
                .success(true)
                .message("Course Updated Successfully")
                .data(courseMapper.toResponse(course))
                .build();
    }

    @Override
    public ApiResponse<String> deleteCourse(Long id) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        courseRepository.delete(course);

        return ApiResponse.<String>builder()
                .success(true)
                .message("Course Deleted Successfully")
                .data(null)
                .build();
    }
}