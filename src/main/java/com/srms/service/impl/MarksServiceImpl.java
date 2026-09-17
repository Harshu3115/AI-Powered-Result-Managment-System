package com.srms.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.srms.dto.request.MarksRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.MarksResponse;
import com.srms.entity.Marks;
import com.srms.entity.Student;
import com.srms.entity.Subject;
import com.srms.entity.Teacher;
import com.srms.entity.User;
import com.srms.enums.DBATUGrade;
import com.srms.enums.Grade;
import com.srms.enums.ResultStatus;
import com.srms.exception.BadRequestException;
import com.srms.exception.ResourceNotFoundException;
import com.srms.mapper.MarksMapper;
import com.srms.repository.MarksRepository;
import com.srms.repository.ResultRepository;
import com.srms.repository.StudentRepository;
import com.srms.repository.SubjectRepository;
import com.srms.repository.TeacherRepository;
import com.srms.repository.TeacherSubjectRepository;
import com.srms.repository.UserRepository;
import com.srms.service.MarksService;

import java.util.HashSet;
import java.util.Set;

import com.srms.dto.request.ResultRequest;
import com.srms.entity.Result;
import com.srms.service.ResultService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MarksServiceImpl implements MarksService {

        private final MarksRepository marksRepository;
        private final StudentRepository studentRepository;
        private final SubjectRepository subjectRepository;
        private final TeacherRepository teacherRepository;
        private final TeacherSubjectRepository teacherSubjectRepository;
        private final UserRepository userRepository;
        private final MarksMapper marksMapper;
        private final ResultService resultService;
        private final ResultRepository resultRepository;

        @Override
        @Transactional
        public ApiResponse<MarksResponse> addMarks(MarksRequest request) {

                Student student = studentRepository.findById(request.getStudentId())
                                .orElseThrow(() -> new ResourceNotFoundException("Student not found."));

                Subject subject = subjectRepository.findById(request.getSubjectId())
                                .orElseThrow(() -> new ResourceNotFoundException("Subject not found."));

                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                String username = authentication.getName();

                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

                Teacher teacher = teacherRepository.findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found."));

                if (!teacherSubjectRepository.existsByTeacherIdAndSubjectId(
                                teacher.getId(),
                                subject.getId())) {

                        throw new BadRequestException(
                                        "You are not assigned to this subject.");
                }

                if (marksRepository.findByStudentIdAndSubjectId(
                                student.getId(),
                                subject.getId()).isPresent()) {

                        throw new BadRequestException(
                                        "Marks already entered.");
                }

                if (request.getInternalMarks() > subject.getInternalMaxMarks()) {

                        throw new BadRequestException(
                                        "Internal marks cannot be greater than "
                                                        + subject.getInternalMaxMarks());
                }

                if (request.getExternalMarks() > subject.getExternalMaxMarks()) {

                        throw new BadRequestException(
                                        "External marks cannot be greater than "
                                                        + subject.getExternalMaxMarks());
                }

                Integer totalMarks = request.getInternalMarks()
                                + request.getExternalMarks();

                DBATUGrade grade = calculateGrade(totalMarks);

                ResultStatus resultStatus = totalMarks >= subject.getPassingMarks()
                                ? ResultStatus.PASS
                                : ResultStatus.FAIL;

                Marks marks = Marks.builder()
                                .student(student)
                                .subject(subject)
                                .teacher(teacher)
                                .internalMarks(request.getInternalMarks())
                                .externalMarks(request.getExternalMarks())
                                .totalMarks(totalMarks)
                                .grade(grade)
                                .resultStatus(resultStatus)
                                .build();

                marks = marksRepository.save(marks);

                // ==========================================
                // AUTOMATIC RESULT GENERATION
                // ==========================================
                System.out.println("=================================");
                System.out.println(">>> MARKS SAVED SUCCESSFULLY");
                System.out.println(">>> MARKS ID = " + marks.getId());
                System.out.println(">>> STUDENT ID = " + student.getId());
                System.out.println(">>> SUBJECT ID = " + subject.getId());
                System.out.println(">>> CHECKING RESULT GENERATION");
                System.out.println("=================================");

                generateOrUpdateResultIfComplete(student);

                System.out.println("=================================");
                System.out.println(">>> RESULT CHECK COMPLETED");
                System.out.println("=================================");

                return ApiResponse.<MarksResponse>builder()
                                .success(true)
                                .message("Marks Added Successfully")
                                .data(marksMapper.toResponse(marks))
                                .build();
        }

        @Override
        public ApiResponse<List<MarksResponse>> getAllMarks() {

                List<MarksResponse> response = marksRepository.findAll()
                                .stream()
                                .map(marksMapper::toResponse)
                                .collect(Collectors.toList());

                return ApiResponse.<List<MarksResponse>>builder()
                                .success(true)
                                .message("Marks List")
                                .data(response)
                                .build();
        }

        @Override
        public ApiResponse<MarksResponse> getMarksById(Long id) {

                Marks marks = marksRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Marks not found."));

                return ApiResponse.<MarksResponse>builder()
                                .success(true)
                                .message("Marks Found")
                                .data(marksMapper.toResponse(marks))
                                .build();
        }

        @Override
        public ApiResponse<List<MarksResponse>> getMarksByStudent(Long studentId) {

                Student student = studentRepository.findById(studentId)
                                .orElseThrow(() -> new ResourceNotFoundException("Student not found."));

                List<MarksResponse> response = marksRepository.findByStudentId(student.getId())
                                .stream()
                                .map(marksMapper::toResponse)
                                .collect(Collectors.toList());

                return ApiResponse.<List<MarksResponse>>builder()
                                .success(true)
                                .message("Student Marks")
                                .data(response)
                                .build();
        }

        public ApiResponse<List<MarksResponse>> getMarksByTeacher() {

                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                String username = authentication.getName();

                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

                Teacher teacher = teacherRepository.findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found."));

                List<MarksResponse> response = marksRepository.findByTeacherId(teacher.getId())
                                .stream()
                                .map(marksMapper::toResponse)
                                .collect(Collectors.toList());

                return ApiResponse.<List<MarksResponse>>builder()
                                .success(true)
                                .message("Teacher Marks")
                                .data(response)
                                .build();
        }

        @Override
        public ApiResponse<String> deleteMarks(Long id) {

                Marks marks = marksRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Marks not found."));

                marksRepository.delete(marks);

                return ApiResponse.<String>builder()
                                .success(true)
                                .message("Marks Deleted Successfully")
                                .data(null)
                                .build();
        }

        @Override
        public ApiResponse<MarksResponse> updateMarks(Long id,
                        MarksRequest request) {

                Marks marks = marksRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Marks not found."));

                Subject subject = subjectRepository.findById(request.getSubjectId())
                                .orElseThrow(() -> new ResourceNotFoundException("Subject not found."));

                Student student = studentRepository.findById(request.getStudentId())
                                .orElseThrow(() -> new ResourceNotFoundException("Student not found."));

                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                String username = authentication.getName();

                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

                Teacher teacher = teacherRepository.findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found."));

                if (!teacherSubjectRepository.existsByTeacherIdAndSubjectId(
                                teacher.getId(),
                                subject.getId())) {

                        throw new BadRequestException(
                                        "You are not assigned to this subject.");
                }

                if (request.getInternalMarks() > subject.getInternalMaxMarks()) {

                        throw new BadRequestException(
                                        "Internal Marks cannot exceed "
                                                        + subject.getInternalMaxMarks());
                }

                if (request.getExternalMarks() > subject.getExternalMaxMarks()) {

                        throw new BadRequestException(
                                        "External Marks cannot exceed "
                                                        + subject.getExternalMaxMarks());
                }

                Integer totalMarks = request.getInternalMarks()
                                + request.getExternalMarks();

                DBATUGrade grade = calculateGrade(totalMarks);

                ResultStatus resultStatus = calculateResultStatus(
                                totalMarks,
                                subject.getPassingMarks());

                marks.setStudent(student);
                marks.setSubject(subject);
                marks.setTeacher(teacher);
                marks.setInternalMarks(request.getInternalMarks());
                marks.setExternalMarks(request.getExternalMarks());
                marks.setTotalMarks(totalMarks);
                marks.setGrade(grade);
                marks.setResultStatus(resultStatus);

                marks = marksRepository.save(marks);

                return ApiResponse.<MarksResponse>builder()
                                .success(true)
                                .message("Marks Updated Successfully")
                                .data(marksMapper.toResponse(marks))
                                .build();
        }

        // =====================================================
        // AUTOMATIC RESULT GENERATION
        // =====================================================

        private void generateOrUpdateResultIfComplete(Student student) {

                System.out.println("=================================");
                System.out.println("### AUTOMATIC RESULT CHECK ###");
                System.out.println("### STUDENT ID = " + student.getId());
                System.out.println("=================================");

                // -------------------------------------------------
                // Check student's semester
                // -------------------------------------------------
                if (student.getSemester() == null) {

                        System.out.println("### STUDENT HAS NO SEMESTER ###");
                        return;
                }

                Long semesterId = student.getSemester().getId();

                System.out.println("### SEMESTER ID = " + semesterId);

                // -------------------------------------------------
                // Get all subjects of student's semester
                // -------------------------------------------------
                List<Subject> semesterSubjects = subjectRepository
                                .findAll()
                                .stream()
                                .filter(subject -> subject.getSemester() != null
                                                && subject.getSemester()
                                                                .getId()
                                                                .equals(semesterId))
                                .toList();

                System.out.println(
                                "### REQUIRED SUBJECTS = "
                                                + semesterSubjects.size());

                if (semesterSubjects.isEmpty()) {

                        System.out.println("### NO SUBJECTS FOUND ###");
                        return;
                }

                // -------------------------------------------------
                // Get student's marks for this semester
                // -------------------------------------------------
                List<Marks> studentMarks = marksRepository.findByStudentIdAndSubjectSemesterId(
                                student.getId(),
                                semesterId);

                // -------------------------------------------------
                // Subjects for which marks are entered
                // -------------------------------------------------
                Set<Long> enteredSubjectIds = studentMarks
                                .stream()
                                .filter(mark -> mark.getSubject() != null)
                                .map(mark -> mark.getSubject().getId())
                                .collect(Collectors.toSet());

                // -------------------------------------------------
                // Required subject IDs
                // -------------------------------------------------
                Set<Long> requiredSubjectIds = semesterSubjects
                                .stream()
                                .map(Subject::getId)
                                .collect(Collectors.toSet());

                // -------------------------------------------------
                // Find missing subjects
                // -------------------------------------------------
                Set<Long> missingSubjectIds = new HashSet<>(requiredSubjectIds);

                missingSubjectIds.removeAll(enteredSubjectIds);

                System.out.println(
                                "### ENTERED SUBJECTS = "
                                                + enteredSubjectIds.size());

                System.out.println(
                                "### MISSING SUBJECTS = "
                                                + missingSubjectIds);

                // -------------------------------------------------
                // If marks are missing, don't generate result
                // -------------------------------------------------
                if (!missingSubjectIds.isEmpty()) {

                        System.out.println(
                                        "### RESULT NOT GENERATED YET ###");

                        System.out.println(
                                        "### WAITING FOR ALL SUBJECT MARKS ###");

                        return;
                }

                // -------------------------------------------------
                // ALL SUBJECTS HAVE MARKS
                // -------------------------------------------------
                System.out.println(
                                "### ALL SUBJECT MARKS AVAILABLE ###");

                // -------------------------------------------------
                // Check existing result
                // -------------------------------------------------
                Result existingResult = resultRepository
                                .findByStudentIdAndSemesterId(
                                                student.getId(),
                                                semesterId)
                                .orElse(null);

                // -------------------------------------------------
                // Existing result -> recalculate
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
                // New result
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
                                "### NEW RESULT GENERATED AUTOMATICALLY ###");
        }

        private DBATUGrade calculateGrade(int totalMarks) {

                if (totalMarks >= 91) {
                        return DBATUGrade.EX;
                } else if (totalMarks >= 86) {
                        return DBATUGrade.AA;
                } else if (totalMarks >= 81) {
                        return DBATUGrade.AB;
                } else if (totalMarks >= 76) {
                        return DBATUGrade.BB;
                } else if (totalMarks >= 71) {
                        return DBATUGrade.BC;
                } else if (totalMarks >= 66) {
                        return DBATUGrade.CC;
                } else if (totalMarks >= 61) {
                        return DBATUGrade.CD;
                } else if (totalMarks >= 56) {
                        return DBATUGrade.DD;
                } else if (totalMarks >= 51) {
                        return DBATUGrade.DE;
                } else if (totalMarks >= 40) {
                        return DBATUGrade.EE;
                } else {
                        return DBATUGrade.EF;
                }
        }

        private ResultStatus calculateResultStatus(
                        Integer totalMarks,
                        Integer passingMarks) {

                if (totalMarks >= passingMarks) {
                        return ResultStatus.PASS;
                }

                return ResultStatus.FAIL;
        }

        private int getGradePoint(DBATUGrade grade) {

                switch (grade) {

                        case EX:
                                return 10;

                        case AA:
                                return 9;

                        case AB:
                                return 8;

                        case BB:
                                return 7;

                        case BC:
                                return 6;

                        case CC:
                                return 5;

                        case CD:
                                return 4;

                        case DD:
                                return 3;

                        case DE:
                                return 2;

                        case EE:
                                return 1;

                        case EF:
                        default:
                                return 0;
                }
        }

        @Override
        @Transactional
        public ApiResponse<List<MarksResponse>> addBulkMarks(
                        List<MarksRequest> requests) {

                List<MarksResponse> responses = requests.stream()
                                .map(request -> addMarks(request).getData())
                                .toList();

                return ApiResponse.<List<MarksResponse>>builder()
                                .success(true)
                                .message("Marks Added Successfully")
                                .data(responses)
                                .build();
        }

}