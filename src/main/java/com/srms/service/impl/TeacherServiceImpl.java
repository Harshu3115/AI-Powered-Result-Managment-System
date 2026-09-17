package com.srms.service.impl;

import com.srms.enums.DBATUGrade;
import com.srms.enums.ExamType;
import com.srms.enums.ResultStatus;
import com.srms.enums.SubjectType;
import com.srms.enums.Role;
import com.srms.entity.Result;
import com.srms.dto.request.ResultRequest;
import com.srms.dto.request.TeacherRequest;
import com.srms.dto.request.TeacherResultRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.RecheckingSubjectResponse;
import com.srms.dto.response.ResultSubjectResponse;
import com.srms.dto.response.SubjectPerformanceResponse;
import com.srms.dto.response.TeacherDashboardResponse;
import com.srms.dto.response.TeacherResponse;
import com.srms.dto.response.TeacherResultResponse;
import com.srms.dto.response.TeacherStudentResponse;
import com.srms.entity.Department;
import com.srms.entity.Marks;
import com.srms.entity.RecheckingRequest;
import com.srms.entity.ResultSubject;
import com.srms.entity.Student;
import com.srms.entity.Subject;
import com.srms.entity.Teacher;
import com.srms.entity.TeacherSubject;
import com.srms.entity.User;
import com.srms.exception.BadRequestException;
import com.srms.exception.ResourceNotFoundException;
import com.srms.mapper.TeacherMapper;
import com.srms.repository.DepartmentRepository;
import com.srms.repository.MarksRepository;
import com.srms.repository.RecheckingSubjectRepository;
import com.srms.repository.ResultRepository;
import com.srms.repository.StudentRepository;
import com.srms.repository.TeacherRepository;
import com.srms.repository.TeacherSubjectRepository;
import com.srms.repository.UserRepository;
import com.srms.service.GradeCalculationService;
import com.srms.service.RecheckingService;
import com.srms.service.TeacherProfileImageService;
import com.srms.service.TeacherService;
import com.srms.repository.SubjectRepository;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.srms.dto.response.AssignedSubjectResponse;
import com.srms.dto.response.PageResponse;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import com.srms.enums.RecheckingStatus;
import com.srms.enums.RecheckingResult;
import com.srms.entity.RecheckingSubject;
import com.srms.dto.response.TeacherRecheckingResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.context.ApplicationEventPublisher;
import com.srms.service.ResultService;

@Service
@RequiredArgsConstructor
public class TeacherServiceImpl implements TeacherService {

        private final TeacherRepository teacherRepository;
        private final DepartmentRepository departmentRepository;
        private final UserRepository userRepository;
        private final TeacherMapper teacherMapper;
        private final PasswordEncoder passwordEncoder;
        private final TeacherSubjectRepository teacherSubjectRepository;
        private final RecheckingService recheckingService;
        private final MarksRepository marksRepository;
        private final ResultRepository resultRepository;
        private final StudentRepository studentRepository;
        private final SubjectRepository subjectRepository;
        private final RecheckingSubjectRepository recheckingSubjectRepository;
        private final TeacherProfileImageService teacherProfileImageService;
        private final GradeCalculationService gradeCalculationService;
        private final ResultService resultService;
        private final ApplicationEventPublisher eventPublisher;

        @Override
        @Transactional
        public ApiResponse<TeacherResponse> addTeacher(
                        TeacherRequest request) {

                if (request.getUsername() == null ||
                                request.getUsername().isBlank()) {

                        throw new BadRequestException(
                                        "Username is required.");
                }

                if (request.getPassword() == null ||
                                request.getPassword().isBlank()) {

                        throw new BadRequestException(
                                        "Password is required.");
                }

                if (teacherRepository.existsByTeacherCode(
                                request.getTeacherCode())) {

                        throw new BadRequestException(
                                        "Teacher Code already exists.");
                }

                if (teacherRepository.existsByEmail(
                                request.getEmail())) {

                        throw new BadRequestException(
                                        "Email already exists.");
                }

                if (userRepository.existsByUsername(
                                request.getUsername())) {

                        throw new BadRequestException(
                                        "Username already exists.");
                }

                if (userRepository.existsByEmail(
                                request.getEmail())) {

                        throw new BadRequestException(
                                        "Email already exists.");
                }

                Department department = departmentRepository.findById(
                                request.getDepartmentId()).orElseThrow(
                                                () -> new ResourceNotFoundException(
                                                                "Department not found."));

                User user = User.builder()
                                .username(request.getUsername())
                                .email(request.getEmail())
                                .password(
                                                passwordEncoder.encode(
                                                                request.getPassword()))
                                .role(Role.TEACHER)
                                .enabled(true)
                                .build();

                user = userRepository.save(user);

                Teacher teacher = Teacher.builder()
                                .teacherCode(request.getTeacherCode())
                                .firstName(request.getFirstName())
                                .lastName(request.getLastName())
                                .email(request.getEmail())
                                .mobile(request.getMobile())
                                .gender(request.getGender())
                                .qualification(request.getQualification())
                                .designation(request.getDesignation())
                                .experience(request.getExperience())
                                .department(department)
                                .user(user)
                                .build();

                teacher = teacherRepository.save(teacher);

                return ApiResponse.<TeacherResponse>builder()
                                .success(true)
                                .message("Teacher Added Successfully")
                                .data(teacherMapper.toResponse(teacher))
                                .build();
        }

        @Override
        @Transactional(readOnly = true)
        public ApiResponse<PageResponse<TeacherResponse>> getAllTeachers(
                        int page,
                        int size) {

                if (page < 0) {
                        page = 0;
                }

                if (size <= 0) {
                        size = 10;
                }

                if (size > 100) {
                        size = 100;
                }

                Pageable pageable = PageRequest.of(
                                page,
                                size,
                                Sort.by(
                                                Sort.Direction.ASC,
                                                "id"));

                Page<Teacher> teacherPage = teacherRepository.findAll(pageable);

                List<TeacherResponse> teachers = teacherPage.getContent()
                                .stream()
                                .map(teacherMapper::toResponse)
                                .toList();

                PageResponse<TeacherResponse> pageResponse = PageResponse.<TeacherResponse>builder()
                                .content(teachers)
                                .page(teacherPage.getNumber())
                                .size(teacherPage.getSize())
                                .totalElements(
                                                teacherPage.getTotalElements())
                                .totalPages(
                                                teacherPage.getTotalPages())
                                .first(
                                                teacherPage.isFirst())
                                .last(
                                                teacherPage.isLast())
                                .build();

                return ApiResponse
                                .<PageResponse<TeacherResponse>>builder()
                                .success(true)
                                .message("Teacher List")
                                .data(pageResponse)
                                .build();
        }

        @Override
        public ApiResponse<TeacherResponse> getTeacherById(Long id) {

                Teacher teacher = teacherRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found."));

                return ApiResponse.<TeacherResponse>builder()
                                .success(true)
                                .message("Teacher Found")
                                .data(teacherMapper.toResponse(teacher))
                                .build();
        }

        @Override
        @Transactional
        public ApiResponse<TeacherResponse> updateTeacher(
                        Long id,
                        TeacherRequest request) {

                Teacher teacher = teacherRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Teacher not found."));

                Department department = departmentRepository.findById(
                                request.getDepartmentId()).orElseThrow(
                                                () -> new ResourceNotFoundException(
                                                                "Department not found."));

                User user = teacher.getUser();

                // ==========================================
                // USERNAME - OPTIONAL DURING UPDATE
                // ==========================================

                if (request.getUsername() != null &&
                                !request.getUsername().isBlank()) {

                        String newUsername = request.getUsername().trim();

                        // Only check duplicate if username changed
                        if (!newUsername.equals(user.getUsername())) {

                                if (userRepository.existsByUsername(
                                                newUsername)) {

                                        throw new BadRequestException(
                                                        "Username already exists.");
                                }

                                user.setUsername(newUsername);
                        }
                }

                // ==========================================
                // EMAIL
                // ==========================================

                if (request.getEmail() != null &&
                                !request.getEmail().isBlank() &&
                                !request.getEmail().equals(user.getEmail())) {

                        if (userRepository.existsByEmail(
                                        request.getEmail())) {

                                throw new BadRequestException(
                                                "Email already exists.");
                        }

                        user.setEmail(request.getEmail());
                }

                // ==========================================
                // PASSWORD
                // ==========================================

                if (request.getPassword() != null &&
                                !request.getPassword().isBlank()) {

                        user.setPassword(
                                        passwordEncoder.encode(
                                                        request.getPassword()));
                }

                userRepository.saveAndFlush(user);

                // ==========================================
                // UPDATE TEACHER
                // ==========================================

                teacher.setTeacherCode(
                                request.getTeacherCode());

                teacher.setFirstName(
                                request.getFirstName());

                teacher.setLastName(
                                request.getLastName());

                teacher.setEmail(
                                request.getEmail());

                teacher.setMobile(
                                request.getMobile());

                teacher.setGender(
                                request.getGender());

                teacher.setQualification(
                                request.getQualification());

                teacher.setDesignation(
                                request.getDesignation());

                teacher.setExperience(
                                request.getExperience());

                teacher.setDepartment(
                                department);

                teacher = teacherRepository.saveAndFlush(teacher);

                return ApiResponse.<TeacherResponse>builder()
                                .success(true)
                                .message("Teacher Updated Successfully")
                                .data(teacherMapper.toResponse(teacher))
                                .build();
        }

        @Override
        public ApiResponse<String> deleteTeacher(Long id) {

                Teacher teacher = teacherRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found."));

                teacherRepository.delete(teacher);

                return ApiResponse.<String>builder()
                                .success(true)
                                .message("Teacher Deleted Successfully")
                                .data(null)
                                .build();
        }

        @Override
        public ApiResponse<TeacherDashboardResponse> getTeacherDashboard(
                        String username) {

                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found."));

                Teacher teacher = teacherRepository.findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Teacher not found."));

                // Assigned subjects
                List<TeacherSubject> teacherSubjects = teacherSubjectRepository.findByTeacher(teacher);

                int totalSubjects = teacherSubjects.size();

                List<AssignedSubjectResponse> assignedSubjects = teacherSubjects.stream()
                                .map(ts -> AssignedSubjectResponse.builder()
                                                .subjectId(ts.getSubject().getId())
                                                .subjectCode(ts.getSubject().getSubjectCode())
                                                .subjectName(ts.getSubject().getSubjectName())
                                                .credits(ts.getSubject().getCredits())
                                                .subjectType(ts.getSubject().getSubjectType())
                                                .semesterName(
                                                                ts.getSubject()
                                                                                .getSemester()
                                                                                .getSemesterName())
                                                .build())
                                .collect(Collectors.toList());

                // Rechecking records assigned to this teacher
                // Use the existing RecheckingService method
                ApiResponse<List<RecheckingSubjectResponse>> recheckingResponse = recheckingService
                                .getTeacherRecheckingRequests(username);

                List<RecheckingSubjectResponse> recheckingRequests = recheckingResponse.getData();

                int pendingRechecking = (int) recheckingRequests.stream()
                                .filter(r -> "PENDING".equals(r.getStatus()))
                                .count();

                int completedRechecking = (int) recheckingRequests.stream()
                                .filter(r -> "COMPLETED".equals(r.getStatus()))
                                .count();

                TeacherDashboardResponse response = TeacherDashboardResponse.builder()
                                .teacherId(teacher.getId())
                                .teacherName(
                                                teacher.getFirstName()
                                                                + " "
                                                                + teacher.getLastName())
                                .email(teacher.getEmail())
                                .departmentName(
                                                teacher.getDepartment()
                                                                .getDepartmentName())
                                .totalSubjects(totalSubjects)
                                .pendingRechecking(pendingRechecking)
                                .completedRechecking(completedRechecking)
                                .assignedSubjects(assignedSubjects)
                                .recheckingRequests(recheckingRequests)
                                .build();

                return ApiResponse.<TeacherDashboardResponse>builder()
                                .success(true)
                                .message("Teacher Dashboard")
                                .data(response)
                                .build();
        }

        @Override
        public ApiResponse<List<AssignedSubjectResponse>> getAssignedSubjects(
                        String username) {

                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found."));

                Teacher teacher = teacherRepository.findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Teacher not found."));

                List<TeacherSubject> teacherSubjects = teacherSubjectRepository.findByTeacher(teacher);

                List<AssignedSubjectResponse> subjects = teacherSubjects.stream()
                                .map(ts -> AssignedSubjectResponse.builder()
                                                .subjectId(
                                                                ts.getSubject().getId())
                                                .subjectCode(
                                                                ts.getSubject().getSubjectCode())
                                                .subjectName(
                                                                ts.getSubject().getSubjectName())
                                                .credits(
                                                                ts.getSubject().getCredits())
                                                .subjectType(
                                                                ts.getSubject().getSubjectType())
                                                .semesterName(
                                                                ts.getSubject()
                                                                                .getSemester()
                                                                                .getSemesterName())
                                                .build())
                                .collect(Collectors.toList());

                return ApiResponse
                                .<List<AssignedSubjectResponse>>builder()
                                .success(true)
                                .message("Assigned subjects fetched successfully")
                                .data(subjects)
                                .build();
        }

        @Override
        public ApiResponse<List<TeacherStudentResponse>> getStudents(
                        String username) {

                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found."));

                Teacher teacher = teacherRepository.findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Teacher not found."));

                // =========================================================
                // GET ALL STUDENTS
                // =========================================================

                List<Student> allStudents = studentRepository.findAll();

                // =========================================================
                // CREATE RESPONSE FOR EVERY STUDENT
                // =========================================================

                List<TeacherStudentResponse> students = allStudents.stream()
                                .map(student -> {

                                        // =================================================
                                        // GET ALL MARKS OF THIS STUDENT
                                        // =================================================

                                        List<Marks> studentMarks = marksRepository.findByStudentId(
                                                        student.getId());

                                        // =================================================
                                        // SEMESTER-WISE SUBJECT COUNT
                                        // =================================================

                                        Map<String, Long> semesterSubjectCounts = studentMarks.stream()

                                                        .filter(mark -> mark.getSubject() != null
                                                                        && mark.getSubject()
                                                                                        .getSemester() != null)

                                                        .collect(
                                                                        Collectors.groupingBy(
                                                                                        mark -> mark.getSubject()
                                                                                                        .getSemester()
                                                                                                        .getSemesterName(),

                                                                                        Collectors.mapping(
                                                                                                        mark -> mark.getSubject()
                                                                                                                        .getId(),

                                                                                                        Collectors.toSet())))

                                                        .entrySet()
                                                        .stream()

                                                        .collect(
                                                                        Collectors.toMap(
                                                                                        Map.Entry::getKey,

                                                                                        entry -> (long) entry
                                                                                                        .getValue()
                                                                                                        .size()));

                                        // =================================================
                                        // TOTAL UNIQUE SUBJECTS
                                        // =================================================

                                        int totalSubjects = semesterSubjectCounts.values()
                                                        .stream()
                                                        .mapToInt(Long::intValue)
                                                        .sum();

                                        // =================================================
                                        // CURRENT SEMESTER RESULT
                                        // =================================================

                                        Result currentResult = null;

                                        if (student.getSemester() != null) {

                                                currentResult = resultRepository
                                                                .findByStudentIdAndSemesterId(
                                                                                student.getId(),
                                                                                student.getSemester().getId())
                                                                .orElse(null);
                                        }

                                        // =================================================
                                        // BUILD RESPONSE
                                        // =================================================

                                        return TeacherStudentResponse.builder()

                                                        .studentId(
                                                                        student.getId())

                                                        .rollNo(
                                                                        student.getRollNo())

                                                        .enrollmentNo(
                                                                        student.getEnrollmentNo())

                                                        .prnNo(
                                                                        student.getPrnNo())

                                                        .studentName(
                                                                        student.getFirstName()
                                                                                        + " "
                                                                                        + student.getLastName())

                                                        .email(
                                                                        student.getEmail())

                                                        .mobile(
                                                                        student.getMobile())

                                                        .admissionYear(
                                                                        student.getAdmissionYear())

                                                        .semesterName(
                                                                        student.getSemester() != null
                                                                                        ? student.getSemester()
                                                                                                        .getSemesterName()
                                                                                        : "Not Assigned")

                                                        // TOTAL
                                                        .subjectsCount(
                                                                        totalSubjects)

                                                        // SEMESTER-WISE
                                                        .semesterSubjectCounts(
                                                                        semesterSubjectCounts)

                                                        .percentage(
                                                                        currentResult != null
                                                                                        ? currentResult.getPercentage()
                                                                                        : null)

                                                        .sgpa(
                                                                        currentResult != null
                                                                                        ? currentResult.getSgpa()
                                                                                        : null)

                                                        .resultStatus(
                                                                        currentResult != null
                                                                                        && currentResult
                                                                                                        .getResultStatus() != null
                                                                                                                        ? currentResult
                                                                                                                                        .getResultStatus()
                                                                                                                                        .name()
                                                                                                                        : null)

                                                        .build();

                                })
                                .toList();

                return ApiResponse
                                .<List<TeacherStudentResponse>>builder()
                                .success(true)
                                .message(
                                                "Students fetched successfully")
                                .data(students)
                                .build();
        }

        @Override
        public ApiResponse<List<SubjectPerformanceResponse>> getSubjectPerformance(
                        String username) {

                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found."));

                Teacher teacher = teacherRepository.findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Teacher not found."));

                List<Marks> marks = marksRepository.findByTeacherId(
                                teacher.getId());

                Map<Long, List<Marks>> grouped = marks.stream()
                                .filter(mark -> mark.getSubject() != null)
                                .collect(
                                                Collectors.groupingBy(
                                                                mark -> mark.getSubject()
                                                                                .getId()));

                List<SubjectPerformanceResponse> result = grouped.values()
                                .stream()
                                .map(subjectMarks -> {

                                        Marks first = subjectMarks.get(0);

                                        double average = subjectMarks.stream()
                                                        .filter(mark -> mark.getTotalMarks() != null)
                                                        .mapToDouble(
                                                                        mark -> mark.getTotalMarks())
                                                        .average()
                                                        .orElse(0);

                                        return SubjectPerformanceResponse
                                                        .builder()
                                                        .subjectName(
                                                                        first.getSubject()
                                                                                        .getSubjectName())
                                                        .averageMarks(
                                                                        average)
                                                        .build();

                                })
                                .toList();

                return ApiResponse
                                .<List<SubjectPerformanceResponse>>builder()
                                .success(true)
                                .message(
                                                "Subject performance fetched successfully")
                                .data(result)
                                .build();
        }

        @Override
        public ApiResponse<List<TeacherResultResponse>> getResults(
                        String username) {

                User user = userRepository
                                .findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found."));

                Teacher teacher = teacherRepository
                                .findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Teacher not found."));

                // Get students connected with this teacher
                List<Marks> teacherMarks = marksRepository.findByTeacherId(
                                teacher.getId());

                List<Long> studentIds = teacherMarks.stream()
                                .filter(mark -> mark.getStudent() != null)
                                .map(mark -> mark.getStudent().getId())
                                .distinct()
                                .toList();

                if (studentIds.isEmpty()) {

                        return ApiResponse
                                        .<List<TeacherResultResponse>>builder()
                                        .success(true)
                                        .message(
                                                        "No student results found")
                                        .data(List.of())
                                        .build();
                }

                // Get all results of these students
                List<Result> results = resultRepository.findByStudentIdIn(
                                studentIds);

                List<TeacherResultResponse> response = results.stream()
                                .map(result -> {

                                        Student student = result.getStudent();

                                        List<Result> studentResults = resultRepository
                                                        .findByStudentIdOrderBySemesterSemesterNumberAsc(
                                                                        student.getId());

                                        double cgpa = studentResults.stream()
                                                        .map(Result::getSgpa)
                                                        .filter(Objects::nonNull)
                                                        .mapToDouble(Double::doubleValue)
                                                        .average()
                                                        .orElse(0.0);

                                        List<ResultSubjectResponse> subjects = result.getResultSubjects()
                                                        .stream()
                                                        .map(resultSubject -> {

                                                                Subject subject = resultSubject
                                                                                .getSubject();

                                                                return ResultSubjectResponse
                                                                                .builder()
                                                                                .resultSubjectId(
                                                                                                resultSubject
                                                                                                                .getId())
                                                                                .subjectId(
                                                                                                subject.getId())
                                                                                .subjectCode(
                                                                                                subject
                                                                                                                .getSubjectCode())
                                                                                .subjectName(
                                                                                                subject
                                                                                                                .getSubjectName())
                                                                                .credits(
                                                                                                resultSubject
                                                                                                                .getCredits())
                                                                                .totalMarks(
                                                                                                resultSubject
                                                                                                                .getTotalMarks())
                                                                                .obtainedMarks(
                                                                                                resultSubject
                                                                                                                .getObtainedMarks())
                                                                                .percentage(
                                                                                                resultSubject
                                                                                                                .getPercentage())
                                                                                .grade(
                                                                                                resultSubject.getGrade() != null
                                                                                                                ? resultSubject.getGrade()
                                                                                                                                .name()
                                                                                                                : null)
                                                                                .gradePoint(
                                                                                                resultSubject
                                                                                                                .getGradePoint())
                                                                                .build();
                                                        })
                                                        .toList();

                                        return TeacherResultResponse
                                                        .builder()
                                                        .studentId(
                                                                        student.getId())
                                                        .prnNo(
                                                                        student.getPrnNo())
                                                        .studentName(
                                                                        student.getFirstName()
                                                                                        + " "
                                                                                        + student.getLastName())
                                                        .rollNo(
                                                                        student.getRollNo())
                                                        .semesterId(
                                                                        result.getSemester()
                                                                                        .getId())
                                                        .semesterName(
                                                                        result.getSemester()
                                                                                        .getSemesterName())
                                                        .totalMarks(
                                                                        result.getTotalMarks())
                                                        .obtainedMarks(
                                                                        result.getObtainedMarks())
                                                        .percentage(
                                                                        result.getPercentage())
                                                        .sgpa(
                                                                        result.getSgpa())
                                                        .resultStatus(
                                                                        result.getResultStatus() != null
                                                                                        ? result.getResultStatus()
                                                                                                        .name()
                                                                                        : null)
                                                        .subjects(subjects)
                                                        .build();
                                }).toList();

                return ApiResponse.<List<TeacherResultResponse>>builder()
                                .success(true)
                                .message(
                                                "Teacher results fetched successfully")
                                .data(response)
                                .build();
        }

        @Override
        @Transactional
        public ApiResponse<String> saveResults(
                        String username,
                        List<TeacherResultRequest> requests) {

                User user = userRepository
                                .findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found."));

                Teacher teacher = teacherRepository
                                .findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Teacher not found."));

                // Store student IDs whose marks were saved
                Set<Long> studentIds = new HashSet<>();

                for (TeacherResultRequest request : requests) {

                        // -----------------------------------------
                        // Validate request
                        // -----------------------------------------
                        if (request.getStudentId() == null) {
                                throw new RuntimeException("Student ID is required");
                        }

                        if (request.getSubjectId() == null) {
                                throw new RuntimeException("Subject ID is required");
                        }

                        if (request.getInternalMarks() == null) {
                                throw new RuntimeException("Internal marks are required");
                        }

                        if (request.getExternalMarks() == null) {
                                throw new RuntimeException("External marks are required");
                        }

                        // -----------------------------------------
                        // Find Student
                        // -----------------------------------------
                        Student student = studentRepository
                                        .findById(request.getStudentId())
                                        .orElseThrow(() -> new RuntimeException(
                                                        "Student not found: "
                                                                        + request.getStudentId()));

                        // -----------------------------------------
                        // Find Subject
                        // -----------------------------------------
                        Subject subject = subjectRepository
                                        .findById(request.getSubjectId())
                                        .orElseThrow(() -> new RuntimeException(
                                                        "Subject not found: "
                                                                        + request.getSubjectId()));

                        // -----------------------------------------
                        // Marks
                        // -----------------------------------------
                        int internalMarks = request.getInternalMarks();
                        int externalMarks = request.getExternalMarks();

                        int internalMaxMarks;
                        int externalMaxMarks;

                        // -----------------------------------------
                        // MARK MAXIMUM BASED ON SUBJECT TYPE
                        // -----------------------------------------
                        if (subject.getSubjectType() == SubjectType.PRACTICAL) {
                                internalMaxMarks = 60;
                                externalMaxMarks = 40;
                        } else {
                                internalMaxMarks = 40;
                                externalMaxMarks = 60;
                        }

                        // -----------------------------------------
                        // MARK VALIDATION
                        // -----------------------------------------
                        if (internalMarks < 0 || internalMarks > internalMaxMarks) {
                                throw new RuntimeException(
                                                "Internal marks must be between 0 and "
                                                                + internalMaxMarks);
                        }

                        if (externalMarks < 0 || externalMarks > externalMaxMarks) {
                                throw new RuntimeException(
                                                "External marks must be between 0 and "
                                                                + externalMaxMarks);
                        }

                        // -----------------------------------------
                        // Calculate Total
                        // -----------------------------------------
                        int totalMarks = internalMarks + externalMarks;

                        // -----------------------------------------
                        // Calculate Grade
                        // -----------------------------------------
                        DBATUGrade grade = gradeCalculationService.calculateGrade(totalMarks);

                        System.out.println("=================================");
                        System.out.println("Student ID = " + student.getId());
                        System.out.println("Subject ID = " + subject.getId());
                        System.out.println("Subject Type = " + subject.getSubjectType());
                        System.out.println("INTERNAL MARKS = " + internalMarks);
                        System.out.println("EXTERNAL MARKS = " + externalMarks);
                        System.out.println("TOTAL MARKS = " + totalMarks);
                        System.out.println("CALCULATED GRADE = " + grade);
                        System.out.println("=================================");

                        // -----------------------------------------
                        // Result Status
                        // -----------------------------------------
                        ResultStatus resultStatus = totalMarks >= 40
                                        ? ResultStatus.PASS
                                        : ResultStatus.FAIL;

                        // -----------------------------------------
                        // Find Existing Marks
                        // -----------------------------------------
                        Marks marks = marksRepository
                                        .findByStudentIdAndSubjectId(
                                                        student.getId(),
                                                        subject.getId())
                                        .orElseGet(Marks::new);

                        // -----------------------------------------
                        // Set Values
                        // -----------------------------------------
                        marks.setStudent(student);
                        marks.setSubject(subject);
                        marks.setTeacher(teacher);
                        marks.setInternalMarks(internalMarks);
                        marks.setExternalMarks(externalMarks);
                        marks.setTotalMarks(totalMarks);
                        marks.setGrade(grade);
                        marks.setResultStatus(resultStatus);

                        // -----------------------------------------
                        // SAVE MARKS
                        // -----------------------------------------
                        System.out.println(">>> BEFORE MARKS SAVE");

                        try {

                                marksRepository.saveAndFlush(marks);

                                System.out.println(">>> AFTER MARKS SAVE");
                                System.out.println(
                                                ">>> MARKS ID = " + marks.getId());

                        } catch (Exception e) {

                                System.out.println(
                                                "========================================");

                                System.out.println(
                                                ">>> ERROR WHILE SAVING MARKS");

                                System.out.println(
                                                ">>> MESSAGE = " + e.getMessage());

                                e.printStackTrace();

                                System.out.println(
                                                "========================================");

                                throw e;
                        }

                        // Remember this student
                        studentIds.add(student.getId());
                }

                // =====================================================
                // IMPORTANT:
                // Generate result ONLY AFTER ALL MARKS ARE SAVED
                // =====================================================

                System.out.println(
                                "========================================");

                System.out.println(
                                ">>> ALL MARKS SAVED");

                System.out.println(
                                ">>> STUDENTS TO PROCESS = " + studentIds);

                System.out.println(
                                "========================================");

                for (Long studentId : studentIds) {

                        Student student = studentRepository
                                        .findById(studentId)
                                        .orElseThrow(() -> new RuntimeException(
                                                        "Student not found: " + studentId));

                        System.out.println(
                                        ">>> GENERATING RESULT FOR STUDENT = "
                                                        + studentId);

                        generateOrUpdateResultIfComplete(student);

                        System.out.println(
                                        ">>> RESULT PROCESS COMPLETED FOR STUDENT = "
                                                        + studentId);
                }

                // -----------------------------------------
                // Final response
                // -----------------------------------------
                return ApiResponse
                                .<String>builder()
                                .success(true)
                                .message("Results saved successfully")
                                .data("Results saved successfully")
                                .build();
        }

        private void generateOrUpdateResultIfComplete(Student student) {

                System.out.println("=================================");
                System.out.println("### ENTERED RESULT CHECK ###");
                System.out.println("### STUDENT ID = " + student.getId());
                System.out.println("=================================");

                if (student.getSemester() == null) {
                        System.out.println("### STUDENT HAS NO SEMESTER ###");
                        return;
                }

                Long semesterId = student.getSemester().getId();

                List<Subject> semesterSubjects = subjectRepository
                                .findAll()
                                .stream()
                                .filter(subject -> subject.getSemester() != null
                                                && subject.getSemester()
                                                                .getId()
                                                                .equals(semesterId))
                                .toList();

                if (semesterSubjects.isEmpty()) {
                        System.out.println("### NO SUBJECTS FOUND ###");
                        return;
                }

                List<Marks> studentMarks = marksRepository.findByStudentIdAndSubjectSemesterId(
                                student.getId(),
                                semesterId);

                Set<Long> enteredSubjectIds = studentMarks
                                .stream()
                                .filter(mark -> mark.getSubject() != null)
                                .map(mark -> mark.getSubject().getId())
                                .collect(Collectors.toSet());

                Set<Long> requiredSubjectIds = semesterSubjects
                                .stream()
                                .map(Subject::getId)
                                .collect(Collectors.toSet());

                Set<Long> missingSubjectIds = new HashSet<>(requiredSubjectIds);

                missingSubjectIds.removeAll(enteredSubjectIds);

                System.out.println(
                                "### REQUIRED SUBJECTS = "
                                                + requiredSubjectIds.size());

                System.out.println(
                                "### ENTERED SUBJECTS = "
                                                + enteredSubjectIds.size());

                System.out.println(
                                "### MISSING SUBJECTS = "
                                                + missingSubjectIds);

                // -------------------------------------------------
                // Not all subjects have marks yet
                // -------------------------------------------------
                if (!missingSubjectIds.isEmpty()) {

                        System.out.println(
                                        "### RESULT NOT GENERATED YET ###");

                        return;
                }

                // -------------------------------------------------
                // All marks are available
                // -------------------------------------------------

                System.out.println(
                                "### ALL SUBJECT MARKS AVAILABLE ###");

                Result existingResult = resultRepository
                                .findByStudentIdAndSemesterId(
                                                student.getId(),
                                                semesterId)
                                .orElse(null);

                // -------------------------------------------------
                // RESULT ALREADY EXISTS
                // -------------------------------------------------

                if (existingResult != null) {

                        System.out.println(
                                        "### RESULT ALREADY EXISTS ###");

                        System.out.println(
                                        "### RESULT ID = "
                                                        + existingResult.getId());

                        System.out.println(
                                        "### RECALCULATING RESULT ###");

                        resultService.recalculateResult(
                                        existingResult.getId());

                        System.out.println(
                                        "### RESULT RECALCULATED ###");

                        return;
                }

                // -------------------------------------------------
                // RESULT DOES NOT EXIST
                // -------------------------------------------------

                System.out.println(
                                "### RESULT DOES NOT EXIST ###");

                System.out.println(
                                "### GENERATING NEW RESULT ###");

                ResultRequest resultRequest = ResultRequest.builder()
                                .studentId(student.getId())
                                .semesterId(semesterId)
                                .build();

                resultService.generateResult(resultRequest);

                System.out.println(
                                "### NEW RESULT GENERATED ###");
        }

        @Override
        @Transactional(readOnly = true)
        public ApiResponse<List<TeacherRecheckingResponse>> getRecheckingRequests(
                        String username) {

                User user = userRepository
                                .findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

                Teacher teacher = teacherRepository
                                .findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found."));

                List<RecheckingSubject> subjects = recheckingSubjectRepository
                                .findByTeacherAndStatus(
                                                teacher,
                                                RecheckingStatus.PENDING);

                List<TeacherRecheckingResponse> result = subjects.stream()
                                .map(subject -> {

                                        RecheckingRequest request = subject.getRecheckingRequest();

                                        ResultSubject resultSubject = subject.getResultSubject();

                                        Student student = request.getStudent();

                                        return TeacherRecheckingResponse
                                                        .builder()
                                                        .recheckingSubjectId(subject.getId())
                                                        .recheckingRequestId(request.getId())

                                                        .studentId(student.getId())
                                                        .prnNo(student.getPrnNo())
                                                        .rollNo(student.getRollNo())
                                                        .studentName(
                                                                        student.getFirstName()
                                                                                        + " "
                                                                                        + student.getLastName())

                                                        .examType(request.getExamType())

                                                        .subjectId(
                                                                        resultSubject
                                                                                        .getSubject()
                                                                                        .getId())

                                                        .subjectCode(
                                                                        resultSubject
                                                                                        .getSubject()
                                                                                        .getSubjectCode())

                                                        .subjectName(
                                                                        resultSubject
                                                                                        .getSubject()
                                                                                        .getSubjectName())

                                                        .oldMarks(subject.getOldMarks())
                                                        .newMarks(subject.getNewMarks())

                                                        .reason(request.getReason())

                                                        .status(subject.getStatus())
                                                        .reviewResult(
                                                                        subject.getReviewResult())

                                                        .appliedAt(request.getAppliedAt())
                                                        .reviewedAt(subject.getReviewedAt())

                                                        .build();
                                })
                                .toList();

                return ApiResponse
                                .<List<TeacherRecheckingResponse>>builder()
                                .success(true)
                                .message("Rechecking requests fetched successfully")
                                .data(result)
                                .build();
        }

        @Override
        @Transactional
        public ApiResponse<TeacherRecheckingResponse> approveRechecking(
                        String username,
                        Long recheckingSubjectId,
                        Integer newMarks) {

                User user = userRepository
                                .findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

                Teacher teacher = teacherRepository
                                .findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found."));

                RecheckingSubject recheckingSubject = recheckingSubjectRepository
                                .findById(recheckingSubjectId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Rechecking request not found."));

                if (!recheckingSubject.getTeacher().getId()
                                .equals(teacher.getId())) {

                        throw new RuntimeException(
                                        "You are not authorized to review this request.");
                }

                if (recheckingSubject.getStatus() != RecheckingStatus.PENDING) {

                        throw new RuntimeException(
                                        "This rechecking request has already been reviewed.");
                }

                if (newMarks == null || newMarks < 0 || newMarks > 100) {

                        throw new RuntimeException(
                                        "Marks must be between 0 and 100.");
                }

                recheckingSubject.setNewMarks(newMarks);

                recheckingSubject.setStatus(
                                RecheckingStatus.APPROVED);

                if (newMarks > recheckingSubject.getOldMarks()) {
                        recheckingSubject.setReviewResult(
                                        RecheckingResult.MARKS_INCREASED);
                } else {
                        recheckingSubject.setReviewResult(
                                        RecheckingResult.NO_CHANGE);
                }

                recheckingSubject.setReviewedAt(
                                LocalDateTime.now());

                recheckingSubjectRepository.save(
                                recheckingSubject);

                return ApiResponse
                                .<TeacherRecheckingResponse>builder()
                                .success(true)
                                .message("Rechecking request approved successfully")
                                .data(
                                                TeacherRecheckingResponse.builder()
                                                                .recheckingSubjectId(
                                                                                recheckingSubject.getId())
                                                                .recheckingRequestId(
                                                                                recheckingSubject
                                                                                                .getRecheckingRequest()
                                                                                                .getId())
                                                                .oldMarks(
                                                                                recheckingSubject.getOldMarks())
                                                                .newMarks(
                                                                                recheckingSubject.getNewMarks())
                                                                .status(
                                                                                recheckingSubject.getStatus())
                                                                .reviewResult(
                                                                                recheckingSubject
                                                                                                .getReviewResult())
                                                                .reviewedAt(
                                                                                recheckingSubject
                                                                                                .getReviewedAt())
                                                                .build())
                                .build();
        }

        @Override
        @Transactional
        public ApiResponse<String> rejectRechecking(
                        String username,
                        Long recheckingSubjectId) {

                User user = userRepository
                                .findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

                Teacher teacher = teacherRepository
                                .findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found."));

                RecheckingSubject recheckingSubject = recheckingSubjectRepository
                                .findById(recheckingSubjectId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Rechecking request not found."));

                if (!recheckingSubject.getTeacher().getId()
                                .equals(teacher.getId())) {

                        throw new RuntimeException(
                                        "You are not authorized to review this request.");
                }

                if (recheckingSubject.getStatus() != RecheckingStatus.PENDING) {

                        throw new RuntimeException(
                                        "This rechecking request has already been reviewed.");
                }

                recheckingSubject.setStatus(
                                RecheckingStatus.REJECTED);

                recheckingSubject.setReviewResult(
                                RecheckingResult.NO_CHANGE);

                recheckingSubject.setReviewedAt(
                                LocalDateTime.now());

                recheckingSubjectRepository.save(
                                recheckingSubject);

                recheckingSubject.setReviewedAt(
                                LocalDateTime.now());

                recheckingSubjectRepository.save(
                                recheckingSubject);

                return ApiResponse
                                .<String>builder()
                                .success(true)
                                .message("Rechecking request rejected successfully")
                                .data("Rechecking request rejected successfully")
                                .build();
        }

        @Override
        @Transactional(readOnly = true)
        public ApiResponse<TeacherResponse> getTeacherProfile(
                        String username) {

                // =========================================================
                // FIND USER
                // =========================================================

                User user = userRepository
                                .findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found."));

                // =========================================================
                // FIND TEACHER
                // =========================================================

                Teacher teacher = teacherRepository
                                .findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Teacher not found."));

                // =========================================================
                // RESPONSE
                // =========================================================

                return ApiResponse
                                .<TeacherResponse>builder()
                                .success(true)
                                .message("Teacher Profile fetched successfully")
                                .data(
                                                teacherMapper.toResponse(teacher))
                                .build();
        }

        @Override
        @Transactional
        public ApiResponse<TeacherResponse> updateProfile(
                        String username,
                        String firstName,
                        String lastName,
                        String email,
                        String mobile,
                        String department,
                        String qualification,
                        String designation,
                        String experience,
                        MultipartFile profileImage) {

                // =========================================================
                // FIND USER
                // =========================================================

                User user = userRepository
                                .findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found."));

                // =========================================================
                // FIND TEACHER
                // =========================================================

                Teacher teacher = teacherRepository
                                .findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Teacher not found."));

                // =========================================================
                // UPDATE BASIC DETAILS
                // =========================================================

                teacher.setFirstName(firstName);
                teacher.setLastName(lastName);
                teacher.setEmail(email);
                teacher.setMobile(mobile);

                // =========================================================
                // UPDATE DEPARTMENT
                // =========================================================

                if (department != null && !department.trim().isEmpty()) {

                        Department departmentEntity = departmentRepository
                                        .findByDepartmentName(
                                                        department.trim())
                                        .orElseThrow(() -> new ResourceNotFoundException(
                                                        "Department not found: "
                                                                        + department));

                        teacher.setDepartment(departmentEntity);
                }

                // =========================================================
                // UPDATE PROFESSIONAL DETAILS
                // =========================================================

                teacher.setQualification(qualification);
                teacher.setDesignation(designation);
                if (experience != null && !experience.trim().isEmpty()) {
                        try {
                                teacher.setExperience(
                                                Integer.parseInt(experience.trim()));
                        } catch (NumberFormatException e) {
                                throw new IllegalArgumentException(
                                                "Experience must be a valid number.");
                        }
                }

                // =========================================================
                // UPDATE PROFILE IMAGE
                // =========================================================

                if (profileImage != null &&
                                !profileImage.isEmpty()) {

                        String imagePath = teacherProfileImageService
                                        .saveProfileImage(
                                                        profileImage,
                                                        teacher.getId());

                        teacher.setProfileImage(imagePath);
                }

                // =========================================================
                // SAVE TEACHER
                // =========================================================

                Teacher savedTeacher = teacherRepository.save(teacher);

                // =========================================================
                // RESPONSE
                // =========================================================

                return ApiResponse.<TeacherResponse>builder()
                                .success(true)
                                .message(
                                                "Teacher profile updated successfully.")
                                .data(
                                                teacherMapper.toResponse(
                                                                savedTeacher))
                                .build();
        }
}