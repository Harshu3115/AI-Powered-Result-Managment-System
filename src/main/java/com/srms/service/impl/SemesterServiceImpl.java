package com.srms.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.srms.dto.request.SemesterRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.SemesterResponse;
import com.srms.entity.Course;
import com.srms.entity.Semester;
import com.srms.enums.ExamMode;
import com.srms.exception.BadRequestException;
import com.srms.exception.ResourceNotFoundException;
import com.srms.mapper.SemesterMapper;
import com.srms.repository.CourseRepository;
import com.srms.repository.SemesterRepository;
import com.srms.service.SemesterService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SemesterServiceImpl implements SemesterService {

        private final SemesterRepository semesterRepository;
        private final CourseRepository courseRepository;
        private final SemesterMapper semesterMapper;

        // =========================================================
        // ADD SEMESTER
        // =========================================================

        @Override
        public ApiResponse<SemesterResponse> addSemester(
                        SemesterRequest request) {

                if (semesterRepository.existsBySemesterNumberAndCourseId(
                                request.getSemesterNumber(),
                                request.getCourseId())) {

                        throw new BadRequestException(
                                        "Semester already exists for this course.");
                }

                Course course = courseRepository
                                .findById(request.getCourseId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Course not found."));

                /*
                 * If Admin selects Exam Mode from dropdown,
                 * use the selected value.
                 *
                 * If Admin does not select any mode:
                 * Odd semester = WINTER
                 * Even semester = SUMMER
                 */
                ExamMode examMode = request.getExamMode();

                if (examMode == null) {
                        examMode = getDefaultExamMode(
                                        request.getSemesterNumber());
                }

                Semester semester = Semester.builder()
                                .semesterNumber(request.getSemesterNumber())
                                .semesterName(request.getSemesterName())
                                .course(course)
                                .examMode(examMode)
                                .build();

                semester = semesterRepository.save(semester);

                return ApiResponse.<SemesterResponse>builder()
                                .success(true)
                                .message("Semester Added Successfully")
                                .data(semesterMapper.toResponse(semester))
                                .build();
        }

        // =========================================================
        // GET ALL SEMESTERS
        // =========================================================

        @Override
        public ApiResponse<List<SemesterResponse>> getAllSemesters() {

                List<SemesterResponse> response = semesterRepository
                                .findAll()
                                .stream()
                                .map(semesterMapper::toResponse)
                                .collect(Collectors.toList());

                return ApiResponse.<List<SemesterResponse>>builder()
                                .success(true)
                                .message("Semester List")
                                .data(response)
                                .build();
        }

        // =========================================================
        // GET SEMESTER BY ID
        // =========================================================

        @Override
        public ApiResponse<SemesterResponse> getSemesterById(Long id) {

                Semester semester = semesterRepository
                                .findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Semester not found."));

                return ApiResponse.<SemesterResponse>builder()
                                .success(true)
                                .message("Semester Found")
                                .data(semesterMapper.toResponse(semester))
                                .build();
        }

        // =========================================================
        // UPDATE SEMESTER
        // =========================================================

        @Override
        public ApiResponse<SemesterResponse> updateSemester(
                        Long id,
                        SemesterRequest request) {

                Semester semester = semesterRepository
                                .findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Semester not found."));

                Course course = courseRepository
                                .findById(request.getCourseId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Course not found."));

                ExamMode examMode = request.getExamMode();

                if (examMode == null) {
                        examMode = getDefaultExamMode(
                                        request.getSemesterNumber());
                }

                semester.setSemesterNumber(
                                request.getSemesterNumber());

                semester.setSemesterName(
                                request.getSemesterName());

                semester.setCourse(course);

                semester.setExamMode(examMode);

                semester = semesterRepository.save(semester);

                return ApiResponse.<SemesterResponse>builder()
                                .success(true)
                                .message("Semester Updated Successfully")
                                .data(semesterMapper.toResponse(semester))
                                .build();
        }

        // =========================================================
        // DELETE SEMESTER
        // =========================================================

        @Override
        public ApiResponse<String> deleteSemester(Long id) {

                Semester semester = semesterRepository
                                .findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Semester not found."));

                semesterRepository.delete(semester);

                return ApiResponse.<String>builder()
                                .success(true)
                                .message("Semester Deleted Successfully")
                                .data(null)
                                .build();
        }

        // =========================================================
        // DEFAULT EXAM MODE
        // =========================================================

        private ExamMode getDefaultExamMode(
                        Integer semesterNumber) {

                if (semesterNumber == null) {
                        return ExamMode.WINTER;
                }

                if (semesterNumber % 2 == 1) {
                        return ExamMode.WINTER;
                }

                return ExamMode.SUMMER;
        }
}