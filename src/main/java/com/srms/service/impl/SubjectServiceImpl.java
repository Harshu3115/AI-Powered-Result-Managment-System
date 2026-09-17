package com.srms.service.impl;

import java.util.List;
import com.srms.repository.TeacherSubjectRepository;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.srms.dto.request.SubjectRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.SubjectResponse;
import com.srms.entity.Semester;
import com.srms.entity.Subject;
import com.srms.enums.SubjectType;
import com.srms.exception.BadRequestException;
import com.srms.exception.ResourceNotFoundException;
import com.srms.mapper.SubjectMapper;
import com.srms.repository.SemesterRepository;
import com.srms.repository.SubjectRepository;
import com.srms.service.SubjectService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubjectServiceImpl implements SubjectService {

        private final SubjectRepository subjectRepository;
        private final SemesterRepository semesterRepository;
        private final SubjectMapper subjectMapper;
        private final TeacherSubjectRepository teacherSubjectRepository;

        @Override
        public ApiResponse<SubjectResponse> addSubject(SubjectRequest request) {

                // 1. Check duplicate subject code
                if (subjectRepository.existsBySubjectCode(request.getSubjectCode())) {
                        throw new BadRequestException("Subject Code already exists.");
                }

                // 2. Find Semester
                Semester semester = semesterRepository.findById(request.getSemesterId())
                                .orElseThrow(() -> new ResourceNotFoundException("Semester not found."));

                // 3. Set marks automatically according to Subject Type
                int internalMaxMarks;
                int externalMaxMarks;

                if (request.getSubjectType() == SubjectType.PRACTICAL) {
                        internalMaxMarks = 60;
                        externalMaxMarks = 40;
                } else {
                        internalMaxMarks = 40;
                        externalMaxMarks = 60;
                }

                // 4. Validate Passing Marks
                int totalMarks = internalMaxMarks + externalMaxMarks;

                if (request.getPassingMarks() > totalMarks) {
                        throw new BadRequestException(
                                        "Passing marks cannot be greater than total marks.");
                }

                // 5. Create Subject
                Subject subject = Subject.builder()
                                .subjectCode(request.getSubjectCode())
                                .subjectName(request.getSubjectName())
                                .credits(request.getCredits())
                                .internalMaxMarks(internalMaxMarks)
                                .externalMaxMarks(externalMaxMarks)
                                .passingMarks(request.getPassingMarks())
                                .subjectType(request.getSubjectType())
                                .semester(semester)
                                .build();

                subject = subjectRepository.save(subject);

                return ApiResponse.<SubjectResponse>builder()
                                .success(true)
                                .message("Subject Added Successfully")
                                .data(subjectMapper.toResponse(subject))
                                .build();
        }

        @Override
        public ApiResponse<List<SubjectResponse>> getAllSubjects() {

                List<SubjectResponse> response = subjectRepository.findAll()
                                .stream()
                                .map(subjectMapper::toResponse)
                                .collect(Collectors.toList());

                return ApiResponse.<List<SubjectResponse>>builder()
                                .success(true)
                                .message("Subject List")
                                .data(response)
                                .build();
        }

        @Override
        public ApiResponse<SubjectResponse> getSubjectById(Long id) {

                Subject subject = subjectRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Subject not found."));

                return ApiResponse.<SubjectResponse>builder()
                                .success(true)
                                .message("Subject Found")
                                .data(subjectMapper.toResponse(subject))
                                .build();
        }

        @Override
        public ApiResponse<SubjectResponse> updateSubject(
                        Long id,
                        SubjectRequest request) {

                Subject subject = subjectRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Subject not found."));

                Semester semester = semesterRepository.findById(request.getSemesterId())
                                .orElseThrow(() -> new ResourceNotFoundException("Semester not found."));

                // Set marks automatically according to Subject Type
                int internalMaxMarks;
                int externalMaxMarks;

                if (request.getSubjectType() == SubjectType.PRACTICAL) {
                        internalMaxMarks = 60;
                        externalMaxMarks = 40;
                } else {
                        internalMaxMarks = 40;
                        externalMaxMarks = 60;
                }

                // Validate Passing Marks
                int totalMarks = internalMaxMarks + externalMaxMarks;

                if (request.getPassingMarks() > totalMarks) {
                        throw new BadRequestException(
                                        "Passing marks cannot be greater than total marks.");
                }

                subject.setSubjectCode(request.getSubjectCode());
                subject.setSubjectName(request.getSubjectName());
                subject.setCredits(request.getCredits());

                subject.setInternalMaxMarks(internalMaxMarks);
                subject.setExternalMaxMarks(externalMaxMarks);

                subject.setPassingMarks(request.getPassingMarks());
                subject.setSubjectType(request.getSubjectType());
                subject.setSemester(semester);

                subject = subjectRepository.save(subject);

                return ApiResponse.<SubjectResponse>builder()
                                .success(true)
                                .message("Subject Updated Successfully")
                                .data(subjectMapper.toResponse(subject))
                                .build();
        }

        @Override
        @Transactional
        public ApiResponse<String> deleteSubject(Long id) {

                Subject subject = subjectRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Subject not found."));

                // Delete teacher-subject mappings first
                teacherSubjectRepository.deleteBySubjectId(id);

                // Delete subject
                subjectRepository.delete(subject);

                return ApiResponse.<String>builder()
                                .success(true)
                                .message("Subject Deleted Successfully")
                                .data(null)
                                .build();
        }
}