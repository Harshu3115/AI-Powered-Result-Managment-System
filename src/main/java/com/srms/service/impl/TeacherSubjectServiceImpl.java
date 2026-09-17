package com.srms.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.srms.dto.request.TeacherSubjectRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.TeacherSubjectResponse;
import com.srms.entity.Subject;
import com.srms.entity.Teacher;
import com.srms.entity.TeacherSubject;
import com.srms.exception.BadRequestException;
import com.srms.exception.ResourceNotFoundException;
import com.srms.mapper.TeacherSubjectMapper;
import com.srms.repository.SubjectRepository;
import com.srms.repository.TeacherRepository;
import com.srms.repository.TeacherSubjectRepository;
import com.srms.service.TeacherSubjectService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeacherSubjectServiceImpl implements TeacherSubjectService {

        private final TeacherSubjectRepository teacherSubjectRepository;
        private final TeacherRepository teacherRepository;
        private final SubjectRepository subjectRepository;
        private final TeacherSubjectMapper teacherSubjectMapper;

        @Override
        public ApiResponse<TeacherSubjectResponse> assignSubject(
                        TeacherSubjectRequest request) {

                if (teacherSubjectRepository.existsByTeacherIdAndSubjectId(
                                request.getTeacherId(),
                                request.getSubjectId())) {

                        throw new BadRequestException(
                                        "Teacher is already assigned to this subject.");
                }

                Teacher teacher = teacherRepository.findById(
                                request.getTeacherId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Teacher not found."));

                Subject subject = subjectRepository.findById(
                                request.getSubjectId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Subject not found."));

                TeacherSubject teacherSubject = TeacherSubject.builder()
                                .teacher(teacher)
                                .subject(subject)
                                .build();

                teacherSubject = teacherSubjectRepository.save(teacherSubject);

                return ApiResponse.<TeacherSubjectResponse>builder()
                                .success(true)
                                .message("Subject Assigned Successfully")
                                .data(teacherSubjectMapper.toResponse(teacherSubject))
                                .build();
        }

        @Override
        public ApiResponse<List<TeacherSubjectResponse>> getAllAssignments() {

                List<TeacherSubjectResponse> response = teacherSubjectRepository.findAll()
                                .stream()
                                .map(teacherSubjectMapper::toResponse)
                                .collect(Collectors.toList());

                return ApiResponse.<List<TeacherSubjectResponse>>builder()
                                .success(true)
                                .message("Assignment List")
                                .data(response)
                                .build();
        }

        @Override
        public ApiResponse<List<TeacherSubjectResponse>> getSubjectsByTeacher(
                        Long teacherId) {

                Teacher teacher = teacherRepository.findById(teacherId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Teacher not found."));

                List<TeacherSubjectResponse> response = teacherSubjectRepository.findByTeacher(teacher)
                                .stream()
                                .map(teacherSubjectMapper::toResponse)
                                .collect(Collectors.toList());

                return ApiResponse.<List<TeacherSubjectResponse>>builder()
                                .success(true)
                                .message("Teacher Subjects")
                                .data(response)
                                .build();
        }

        @Override
        public ApiResponse<String> deleteAssignment(Long id) {

                TeacherSubject assignment = teacherSubjectRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Assignment not found."));

                teacherSubjectRepository.delete(assignment);

                return ApiResponse.<String>builder()
                                .success(true)
                                .message("Assignment Deleted Successfully")
                                .data(null)
                                .build();
        }

        @Override
        public ApiResponse<TeacherSubjectResponse> updateAssignment(
                        Long id,
                        TeacherSubjectRequest request) {

                TeacherSubject assignment = teacherSubjectRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Assignment not found."));

                Teacher teacher = teacherRepository.findById(
                                request.getTeacherId()).orElseThrow(
                                                () -> new ResourceNotFoundException(
                                                                "Teacher not found."));

                Subject subject = subjectRepository.findById(
                                request.getSubjectId()).orElseThrow(
                                                () -> new ResourceNotFoundException(
                                                                "Subject not found."));

                // Prevent duplicate assignment
                boolean alreadyExists = teacherSubjectRepository
                                .existsByTeacherIdAndSubjectId(
                                                request.getTeacherId(),
                                                request.getSubjectId());

                if (alreadyExists &&
                                !assignment.getTeacher().getId()
                                                .equals(request.getTeacherId())) {

                        throw new BadRequestException(
                                        "This teacher is already assigned to this subject.");
                }

                assignment.setTeacher(teacher);
                assignment.setSubject(subject);

                TeacherSubject updatedAssignment = teacherSubjectRepository.save(assignment);

                return ApiResponse.<TeacherSubjectResponse>builder()
                                .success(true)
                                .message("Assignment updated successfully")
                                .data(
                                                teacherSubjectMapper.toResponse(
                                                                updatedAssignment))
                                .build();
        }
}