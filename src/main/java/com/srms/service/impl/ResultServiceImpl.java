package com.srms.service.impl;

import java.util.List;
import java.util.Set;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.srms.dto.request.ResultRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.CGPAResponse;
import com.srms.dto.response.ResultResponse;
import com.srms.dto.response.StudentDashboardResponse;
import com.srms.entity.Marks;
import com.srms.entity.Result;
import com.srms.entity.Semester;
import com.srms.entity.Student;
import com.srms.repository.SubjectRepository;
import com.srms.entity.Subject;
import com.srms.entity.User;
import com.srms.enums.ResultStatus;
import com.srms.exception.BadRequestException;
import com.srms.exception.ResourceNotFoundException;
import com.srms.mapper.ResultMapper;
import com.srms.repository.MarksRepository;
import com.srms.repository.ResultRepository;
import com.srms.repository.SemesterRepository;
import com.srms.repository.StudentRepository;
import com.srms.repository.UserRepository;
import com.srms.service.ResultService;
import java.io.ByteArrayOutputStream;

import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Element;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import lombok.RequiredArgsConstructor;
import java.util.ArrayList;
import java.util.HashSet;

import com.srms.entity.ResultSubject;
import com.srms.enums.DBATUGrade;
import com.srms.repository.ResultSubjectRepository;
import com.srms.service.EmailService;
import com.srms.service.GradeCalculationService;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ResultServiceImpl implements ResultService {

        private final ResultRepository resultRepository;
        private final StudentRepository studentRepository;
        private final SemesterRepository semesterRepository;
        private final MarksRepository marksRepository;
        private final ResultSubjectRepository resultSubjectRepository;
        private final ResultMapper resultMapper;
        private final UserRepository userRepository;
        private final EmailService emailService;
        private final GradeCalculationService gradeCalculationService;
        private final SubjectRepository subjectRepository;

        @Override
        @Transactional
        public ApiResponse<ResultResponse> generateResult(ResultRequest request) {

                // =========================================================
                // FIND STUDENT
                // =========================================================
                Student student = studentRepository.findById(request.getStudentId())
                                .orElseThrow(() -> new ResourceNotFoundException("Student not found."));

                // =========================================================
                // FIND SEMESTER
                // =========================================================
                Semester semester = semesterRepository.findById(request.getSemesterId())
                                .orElseThrow(() -> new ResourceNotFoundException("Semester not found."));

                // =========================================================
                // CHECK STUDENT BELONGS TO SEMESTER
                // =========================================================
                if (student.getSemester() == null
                                || !student.getSemester().getId().equals(semester.getId())) {

                        throw new BadRequestException(
                                        "Student does not belong to this semester.");
                }

                // =========================================================
                // CHECK DUPLICATE RESULT
                // =========================================================
                if (resultRepository
                                .findByStudentIdAndSemesterId(
                                                student.getId(),
                                                semester.getId())
                                .isPresent()) {

                        throw new BadRequestException(
                                        "Result already generated for this semester.");
                }

                // =========================================================
                // GET MARKS
                // =========================================================
                List<Marks> marksList = marksRepository.findByStudentIdAndSubjectSemesterId(
                                student.getId(),
                                semester.getId());

                if (marksList.isEmpty()) {
                        throw new BadRequestException(
                                        "No marks found for this semester.");
                }

                // =========================================================
                // GET ALL REQUIRED SUBJECTS
                // =========================================================
                List<Subject> semesterSubjects = subjectRepository.findAll()
                                .stream()
                                .filter(subject -> subject.getSemester() != null
                                                && subject.getSemester()
                                                                .getId()
                                                                .equals(semester.getId()))
                                .toList();

                if (semesterSubjects.isEmpty()) {
                        throw new BadRequestException(
                                        "No subjects found for this semester.");
                }

                // =========================================================
                // CHECK THAT ALL SUBJECT MARKS ARE ENTERED
                // =========================================================
                Set<Long> requiredSubjectIds = semesterSubjects.stream()
                                .map(Subject::getId)
                                .collect(Collectors.toSet());

                Set<Long> enteredSubjectIds = marksList.stream()
                                .filter(mark -> mark.getSubject() != null)
                                .map(mark -> mark.getSubject().getId())
                                .collect(Collectors.toSet());

                Set<Long> missingSubjectIds = new HashSet<>(requiredSubjectIds);
                missingSubjectIds.removeAll(enteredSubjectIds);

                System.out.println("=================================");
                System.out.println("GENERATING RESULT");
                System.out.println("STUDENT ID = " + student.getId());
                System.out.println("SEMESTER ID = " + semester.getId());
                System.out.println("REQUIRED SUBJECTS = "
                                + requiredSubjectIds.size());
                System.out.println("ENTERED SUBJECTS = "
                                + enteredSubjectIds.size());
                System.out.println("MISSING SUBJECTS = "
                                + missingSubjectIds);
                System.out.println("=================================");

                if (!missingSubjectIds.isEmpty()) {
                        throw new BadRequestException(
                                        "Marks are not entered for all subjects. "
                                                        + "Missing subject IDs: "
                                                        + missingSubjectIds);
                }

                // =========================================================
                // INITIAL VALUES
                // =========================================================
                int totalMarks = 0;
                int obtainedMarks = 0;

                double totalCreditPoints = 0.0;
                int totalCredits = 0;

                boolean failed = false;

                List<ResultSubject> resultSubjects = new ArrayList<>();

                // =========================================================
                // CREATE RESULT OBJECT
                // =========================================================
                Result result = Result.builder()
                                .student(student)
                                .semester(semester)
                                .examMode(semester.getExamMode())
                                .build();

                // =========================================================
                // PROCESS EACH SUBJECT
                // =========================================================
                for (Marks marks : marksList) {

                        // -----------------------------------------------------
                        // VALIDATE SUBJECT
                        // -----------------------------------------------------
                        Subject subject = marks.getSubject();

                        if (subject == null) {
                                throw new BadRequestException(
                                                "Subject not found for marks.");
                        }

                        // -----------------------------------------------------
                        // VALIDATE CREDITS
                        // -----------------------------------------------------
                        if (subject.getCredits() == null
                                        || subject.getCredits() <= 0) {

                                throw new BadRequestException(
                                                "Invalid subject credits for subject: "
                                                                + subject.getSubjectName());
                        }

                        // -----------------------------------------------------
                        // SUBJECT MAX MARKS
                        // -----------------------------------------------------
                        Integer internalMaxMarks = subject.getInternalMaxMarks();

                        Integer externalMaxMarks = subject.getExternalMaxMarks();

                        if (internalMaxMarks == null
                                        || externalMaxMarks == null) {

                                throw new BadRequestException(
                                                "Maximum marks are not configured for subject: "
                                                                + subject.getSubjectName());
                        }

                        int subjectTotal = internalMaxMarks + externalMaxMarks;

                        if (subjectTotal <= 0) {
                                throw new BadRequestException(
                                                "Invalid maximum marks for subject: "
                                                                + subject.getSubjectName());
                        }

                        // -----------------------------------------------------
                        // OBTAINED MARKS
                        // -----------------------------------------------------
                        Integer marksTotal = marks.getTotalMarks();

                        if (marksTotal == null) {
                                throw new BadRequestException(
                                                "Total marks are missing for subject: "
                                                                + subject.getSubjectName());
                        }

                        int subjectObtained = marksTotal;

                        if (subjectObtained < 0
                                        || subjectObtained > subjectTotal) {

                                throw new BadRequestException(
                                                "Invalid obtained marks for subject: "
                                                                + subject.getSubjectName());
                        }

                        // -----------------------------------------------------
                        // PERCENTAGE
                        // -----------------------------------------------------
                        double percentage = ((double) subjectObtained / subjectTotal)
                                        * 100.0;

                        percentage = Math.round(percentage * 100.0)
                                        / 100.0;

                        // -----------------------------------------------------
                        // CALCULATE DBATU GRADE
                        // -----------------------------------------------------
                        DBATUGrade grade = gradeCalculationService
                                        .calculateGrade(subjectObtained);

                        // -----------------------------------------------------
                        // GRADE POINT
                        // -----------------------------------------------------
                        double gradePoint = getGradePoint(grade);

                        // -----------------------------------------------------
                        // CREDITS
                        // -----------------------------------------------------
                        int credits = subject.getCredits();

                        // -----------------------------------------------------
                        // TOTAL CALCULATIONS
                        // -----------------------------------------------------
                        totalMarks += subjectTotal;

                        obtainedMarks += subjectObtained;

                        totalCreditPoints += credits * gradePoint;

                        totalCredits += credits;

                        // -----------------------------------------------------
                        // FAIL CHECK
                        // -----------------------------------------------------
                        if (grade == DBATUGrade.EF) {
                                failed = true;
                        }

                        // -----------------------------------------------------
                        // CREATE RESULT SUBJECT
                        // -----------------------------------------------------
                        ResultSubject resultSubject = ResultSubject.builder()
                                        .result(result)
                                        .subject(subject)
                                        .credits(credits)
                                        .totalMarks(subjectTotal)
                                        .obtainedMarks(subjectObtained)
                                        .percentage(percentage)
                                        .grade(grade)
                                        .gradePoint(gradePoint)
                                        .build();

                        resultSubjects.add(resultSubject);

                        System.out.println(
                                        "Subject = "
                                                        + subject.getSubjectName()
                                                        + " | Marks = "
                                                        + subjectObtained
                                                        + "/"
                                                        + subjectTotal
                                                        + " | Grade = "
                                                        + grade
                                                        + " | Grade Point = "
                                                        + gradePoint);
                }

                // =========================================================
                // CHECK TOTAL CREDITS
                // =========================================================
                if (totalCredits <= 0) {
                        throw new BadRequestException(
                                        "Total credits cannot be zero.");
                }

                // =========================================================
                // CHECK TOTAL MARKS
                // =========================================================
                if (totalMarks <= 0) {
                        throw new BadRequestException(
                                        "Total marks cannot be zero.");
                }

                // =========================================================
                // MARKS PERCENTAGE
                // =========================================================

                double overallPercentage = ((double) obtainedMarks / totalMarks) * 100.0;

                overallPercentage = Math.round(overallPercentage * 100.0) / 100.0;

                // =========================================================
                // CALCULATE SGPA
                // =========================================================

                double sgpa = totalCreditPoints / totalCredits;

                sgpa = Math.round(sgpa * 100.0) / 100.0;

                // =========================================================
                // DBATU SGPA-TO-PERCENTAGE CONVERSION
                // For semester result display only if required
                // =========================================================

                double cgpaPercentage = (sgpa - 0.5) * 10.0;

                cgpaPercentage = Math.round(cgpaPercentage * 100.0) / 100.0;

                // =========================================================
                // RESULT STATUS
                // =========================================================
                ResultStatus resultStatus = failed
                                ? ResultStatus.FAIL
                                : ResultStatus.PASS;

                // =========================================================
                // SET RESULT VALUES
                // =========================================================
                result.setTotalMarks(totalMarks);

                result.setObtainedMarks(obtainedMarks);

                result.setPercentage(cgpaPercentage);
                result.setSgpa(sgpa);
                result.setCgpaPercentage(cgpaPercentage);

                result.setResultStatus(resultStatus);

                result.setResultSubjects(resultSubjects);

                // =========================================================
                // SAVE RESULT
                // =========================================================
                result = resultRepository.saveAndFlush(result);

                System.out.println("=================================");
                System.out.println("RESULT SAVED SUCCESSFULLY");
                System.out.println(
                                "RESULT ID = " + result.getId());
                System.out.println(
                                "TOTAL MARKS = "
                                                + obtainedMarks
                                                + "/"
                                                + totalMarks);
                System.out.println(
                                "PERCENTAGE = "
                                                + overallPercentage);
                System.out.println(
                                "SGPA = " + sgpa);
                System.out.println(
                                "STATUS = " + resultStatus);
                System.out.println("=================================");

                // =========================================================
                // SEND EMAIL
                // IMPORTANT:
                // EMAIL FAILURE MUST NOT STOP RESULT GENERATION
                // =========================================================
                try {

                        String studentName = student.getFirstName()
                                        + " "
                                        + student.getLastName();

                        emailService.sendResultGeneratedEmail(
                                        student.getUser().getEmail(),
                                        studentName,
                                        result.getId());

                        System.out.println(
                                        "Result generated email sent successfully.");

                } catch (Exception e) {

                        System.err.println(
                                        "Result generated successfully, "
                                                        + "but email could not be sent.");

                        System.err.println(
                                        "Email Error: "
                                                        + e.getMessage());
                }

                // =========================================================
                // RETURN RESPONSE
                // =========================================================
                return ApiResponse.<ResultResponse>builder()
                                .success(true)
                                .message(
                                                "Result Generated Successfully")
                                .data(
                                                resultMapper.toResponse(result))
                                .build();
        }

        @Override
        public ApiResponse<ResultResponse> getResultById(Long id) {

                Result result = resultRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Result not found."));

                return ApiResponse.<ResultResponse>builder()
                                .success(true)
                                .message("Result Found")
                                .data(resultMapper.toResponse(result))
                                .build();
        }

        @Override
        public ApiResponse<ResultResponse> getStudentSemesterResult(
                        Long studentId,
                        Long semesterId) {

                Result result = resultRepository.findByStudentIdAndSemesterId(
                                studentId,
                                semesterId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Result not found."));

                return ApiResponse.<ResultResponse>builder()
                                .success(true)
                                .message("Student Result")
                                .data(resultMapper.toResponse(result))
                                .build();
        }

        @Override
        public ApiResponse<List<ResultResponse>> getStudentResults(
                        Long studentId) {

                studentRepository.findById(studentId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Student not found."));

                List<ResultResponse> response = resultRepository.findByStudentId(studentId)
                                .stream()
                                .map(resultMapper::toResponse)
                                .collect(Collectors.toList());

                return ApiResponse.<List<ResultResponse>>builder()
                                .success(true)
                                .message("Student Results")
                                .data(response)
                                .build();
        }

        @Override
        public ApiResponse<List<ResultResponse>> getAllResults() {

                List<ResultResponse> response = resultRepository.findAll()
                                .stream()
                                .map(resultMapper::toResponse)
                                .collect(Collectors.toList());

                return ApiResponse.<List<ResultResponse>>builder()
                                .success(true)
                                .message("Result List")
                                .data(response)
                                .build();
        }

        @Override
        public ApiResponse<String> deleteResult(Long id) {

                Result result = resultRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Result not found."));

                resultRepository.delete(result);

                return ApiResponse.<String>builder()
                                .success(true)
                                .message("Result Deleted Successfully")
                                .data(null)
                                .build();
        }

        private String getExaminationTitle(Result result) {

                if (result.getExamMode() == null) {
                        return "Semester Examination";
                }

                return switch (result.getExamMode()) {

                        case SUMMER -> "Summer Semester Examination";

                        case WINTER -> "Winter Semester Examination";
                };
        }

        private double getGradePoint(DBATUGrade grade) {

                switch (grade) {

                        case EX:
                                return 10.0;

                        case AA:
                                return 9.0;

                        case AB:
                                return 8.5;

                        case BB:
                                return 8.0;

                        case BC:
                                return 7.5;

                        case CC:
                                return 7.0;

                        case CD:
                                return 6.5;

                        case DD:
                                return 6.0;

                        case DE:
                                return 5.5;

                        case EE:
                                return 5.0;

                        case EF:
                        default:
                                return 0.0;
                }
        }

        @Override
        public ApiResponse<CGPAResponse> getStudentCGPA(Long studentId) {

                Student student = studentRepository.findById(studentId)
                                .orElseThrow(() -> new ResourceNotFoundException("Student not found."));

                List<ResultSubject> resultSubjects = resultSubjectRepository.findByResultStudentId(studentId);

                if (resultSubjects.isEmpty()) {
                        CGPAResponse response = CGPAResponse.builder()
                                        .studentId(student.getId())
                                        .studentName(
                                                        student.getFirstName() + " "
                                                                        + student.getLastName())
                                        .rollNo(student.getRollNo())
                                        .totalSemesters(0)
                                        .cgpa(0.0)
                                        .percentage(0.0)
                                        .build();

                        return ApiResponse.<CGPAResponse>builder()
                                        .success(true)
                                        .message("No semester results found yet")
                                        .data(response)
                                        .build();
                }

                double totalCreditPoints = 0.0;
                int totalCredits = 0;

                for (ResultSubject resultSubject : resultSubjects) {

                        int credits = resultSubject.getCredits();

                        double gradePoint = resultSubject.getGradePoint();

                        totalCreditPoints += credits * gradePoint;

                        totalCredits += credits;
                }

                if (totalCredits == 0) {
                        throw new BadRequestException(
                                        "Total credits cannot be zero.");
                }

                // =========================================================
                // OVERALL CREDIT-WEIGHTED CGPA
                // =========================================================

                double cgpa = totalCreditPoints / totalCredits;

                cgpa = Math.round(cgpa * 100.0) / 100.0;

                // =========================================================
                // DBATU CGPA-TO-PERCENTAGE FORMULA
                // Percentage = (CGPA × 10) − 0.75
                // =========================================================

                double cgpaPercentage = (cgpa * 10.0) - 0.75;

                cgpaPercentage = Math.round(cgpaPercentage * 100.0) / 100.0;

                // =========================================================
                // COUNT DISTINCT SEMESTERS
                // =========================================================

                int totalSemesters = (int) resultSubjects.stream()
                                .map(rs -> rs.getResult().getId())
                                .distinct()
                                .count();

                // =========================================================
                // BUILD RESPONSE
                // =========================================================

                CGPAResponse response = CGPAResponse.builder()
                                .studentId(student.getId())
                                .studentName(
                                                student.getFirstName()
                                                                + " "
                                                                + student.getLastName())
                                .rollNo(student.getRollNo())
                                .totalSemesters(totalSemesters)
                                .cgpa(cgpa)
                                .percentage(cgpaPercentage)
                                .build();

                return ApiResponse.<CGPAResponse>builder()
                                .success(true)
                                .message("CGPA Calculated Successfully")
                                .data(response)
                                .build();
        }

        @Override
        public ApiResponse<List<ResultResponse>> getStudentResultsByUsername(
                        String username) {

                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found."));

                Student student = studentRepository.findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Student not found."));

                List<ResultResponse> results = resultRepository.findByStudentId(student.getId())
                                .stream()
                                .map(resultMapper::toResponse)
                                .collect(Collectors.toList());

                return ApiResponse.<List<ResultResponse>>builder()
                                .success(true)
                                .message("My Results")
                                .data(results)
                                .build();
        }

        @Override
        public ApiResponse<ResultResponse> getMySemesterResult(
                        String username,
                        Long semesterId) {

                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found."));

                Student student = studentRepository.findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Student not found."));

                Result result = resultRepository
                                .findByStudentIdAndSemesterId(
                                                student.getId(),
                                                semesterId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Result not found for this semester."));

                return ApiResponse.<ResultResponse>builder()
                                .success(true)
                                .message("My Semester Result")
                                .data(resultMapper.toResponse(result))
                                .build();
        }

        @Override
        public ApiResponse<CGPAResponse> getStudentCGPAByUsername(
                        String username) {

                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found."));

                Student student = studentRepository.findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Student not found."));

                return getStudentCGPA(student.getId());
        }

        @Override
        public ApiResponse<StudentDashboardResponse> getStudentDashboard(
                        String username) {

                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found."));

                Student student = studentRepository.findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Student not found."));

                String courseName = "";
                String departmentName = "";
                String currentSemester = "";

                // Set course, department and semester values here

                List<Result> results = resultRepository
                                .findByStudentIdOrderBySemesterSemesterNumberAsc(student.getId());

                if (results.isEmpty()) {

                        StudentDashboardResponse response = StudentDashboardResponse.builder()
                                        .studentId(student.getId())
                                        .studentName(
                                                        student.getFirstName() + " " + student.getLastName())
                                        .rollNo(student.getRollNo())
                                        .courseName(courseName)
                                        .departmentName(departmentName)
                                        .currentSemester(currentSemester)
                                        .latestSgpa(0.0)
                                        .cgpa(0.0)
                                        .cgpaPercentage(0.0)
                                        .totalCredits(0)
                                        .build();

                        return ApiResponse.<StudentDashboardResponse>builder()
                                        .success(true)
                                        .message("No results found yet")
                                        .data(response)
                                        .build();
                }

                Result latestResult = results.get(results.size() - 1);

                ApiResponse<CGPAResponse> cgpaResponse = getStudentCGPA(student.getId());

                CGPAResponse cgpaData = cgpaResponse.getData();

                List<ResultResponse> resultResponses = results.stream()
                                .map(resultMapper::toResponse)
                                .collect(Collectors.toList());

                List<ResultSubject> allResultSubjects = results.stream()
                                .filter(Objects::nonNull)
                                .flatMap(result -> {

                                        if (result.getResultSubjects() == null) {
                                                return Stream.empty();
                                        }

                                        return result.getResultSubjects().stream();
                                })
                                .filter(Objects::nonNull)
                                .toList();

                int totalSubjects = allResultSubjects.size();

                int passedSubjects = (int) allResultSubjects.stream()
                                .filter(subject -> subject.getGrade() != null)
                                .filter(subject -> !subject.getGrade().name().equalsIgnoreCase("EF"))
                                .count();

                int backlogs = (int) allResultSubjects.stream()
                                .filter(subject -> subject.getGrade() != null)
                                .filter(subject -> subject.getGrade().name().equalsIgnoreCase("EF"))
                                .count();

                int totalCredits = allResultSubjects.stream()
                                .filter(subject -> subject.getCredits() != null)
                                .mapToInt(ResultSubject::getCredits)
                                .sum();

                StudentDashboardResponse response = StudentDashboardResponse.builder()
                                .studentId(student.getId())
                                .studentName(
                                                student.getFirstName() + " " + student.getLastName())
                                .rollNo(student.getRollNo())
                                .courseName(courseName)
                                .departmentName(departmentName)
                                .currentSemester(currentSemester)

                                .latestSgpa(
                                                latestResult != null && latestResult.getSgpa() != null
                                                                ? latestResult.getSgpa()
                                                                : 0.0)

                                .cgpa(
                                                cgpaData != null && cgpaData.getCgpa() != null
                                                                ? cgpaData.getCgpa()
                                                                : 0.0)

                                .cgpaPercentage(
                                                cgpaData != null && cgpaData.getPercentage() != null
                                                                ? cgpaData.getPercentage()
                                                                : 0.0)

                                .totalCredits(totalCredits)
                                .totalSubjects(totalSubjects)
                                .passedSubjects(passedSubjects)
                                .backlogs(backlogs)
                                .latestResultStatus(
                                                latestResult != null && latestResult.getResultStatus() != null
                                                                ? latestResult.getResultStatus().name()
                                                                : null)
                                .semesterResults(resultResponses)
                                .build();

                return ApiResponse.<StudentDashboardResponse>builder()
                                .success(true)
                                .message("Student Dashboard")
                                .data(response)
                                .build();
        }

        @Override
        @Transactional
        public void recalculateResult(Long resultId) {

                // =========================================================
                // FIND EXISTING RESULT
                // =========================================================
                Result result = resultRepository.findById(resultId)
                                .orElseThrow(() -> new ResourceNotFoundException("Result not found."));

                Student student = result.getStudent();
                Semester semester = result.getSemester();

                // =========================================================
                // GET LATEST MARKS
                // =========================================================
                List<Marks> marksList = marksRepository.findByStudentIdAndSubjectSemesterId(
                                student.getId(),
                                semester.getId());

                if (marksList.isEmpty()) {
                        throw new BadRequestException(
                                        "No marks found for this semester.");
                }

                // =========================================================
                // EXISTING RESULT SUBJECTS
                // =========================================================
                List<ResultSubject> existingResultSubjects = resultSubjectRepository.findByResultId(resultId);

                // Map existing ResultSubject by Subject ID
                Map<Long, ResultSubject> resultSubjectMap = existingResultSubjects.stream()
                                .filter(rs -> rs.getSubject() != null)
                                .collect(Collectors.toMap(
                                                rs -> rs.getSubject().getId(),
                                                rs -> rs));

                int totalMarks = 0;
                int obtainedMarks = 0;

                double totalCreditPoints = 0.0;
                int totalCredits = 0;

                boolean failed = false;

                // =========================================================
                // PROCESS LATEST MARKS
                // =========================================================
                for (Marks marks : marksList) {

                        if (marks.getSubject() == null) {
                                throw new BadRequestException(
                                                "Subject not found for marks.");
                        }

                        Integer credits = marks.getSubject().getCredits();

                        if (credits == null || credits <= 0) {
                                throw new BadRequestException(
                                                "Invalid subject credits.");
                        }

                        // -----------------------------------------------------
                        // SUBJECT TOTAL MARKS
                        // -----------------------------------------------------
                        int subjectTotal = marks.getSubject().getInternalMaxMarks()
                                        + marks.getSubject().getExternalMaxMarks();

                        int subjectObtained = marks.getTotalMarks();

                        // -----------------------------------------------------
                        // PERCENTAGE
                        // -----------------------------------------------------
                        double percentage = ((double) subjectObtained / subjectTotal) * 100.0;

                        percentage = Math.round(percentage * 100.0) / 100.0;

                        // -----------------------------------------------------
                        // GRADE
                        // -----------------------------------------------------
                        DBATUGrade grade = gradeCalculationService.calculateGrade(
                                        subjectObtained);

                        double gradePoint = getGradePoint(grade);

                        // -----------------------------------------------------
                        // OVERALL CALCULATION
                        // -----------------------------------------------------
                        totalMarks += subjectTotal;
                        obtainedMarks += subjectObtained;

                        totalCreditPoints += credits * gradePoint;
                        totalCredits += credits;

                        if (grade == DBATUGrade.EF) {
                                failed = true;
                        }

                        // =====================================================
                        // FIND EXISTING RESULT SUBJECT
                        // =====================================================
                        ResultSubject resultSubject = resultSubjectMap.get(
                                        marks.getSubject().getId());

                        if (resultSubject == null) {
                                resultSubject = ResultSubject.builder()
                                                .result(result)
                                                .subject(marks.getSubject())
                                                .build();

                                resultSubjectRepository.save(resultSubject);
                        }

                        // =====================================================
                        // UPDATE EXISTING RESULT SUBJECT
                        // =====================================================
                        resultSubject.setResult(result);
                        resultSubject.setSubject(marks.getSubject());
                        resultSubject.setCredits(credits);
                        resultSubject.setTotalMarks(subjectTotal);
                        resultSubject.setObtainedMarks(subjectObtained);
                        resultSubject.setPercentage(percentage);
                        resultSubject.setGrade(grade);
                        resultSubject.setGradePoint(gradePoint);
                }

                // =========================================================
                // VALIDATE CREDITS
                // =========================================================
                if (totalCredits == 0) {
                        throw new BadRequestException(
                                        "Total credits cannot be zero.");
                }

                // =========================================================
                // OVERALL PERCENTAGE
                // =========================================================
                double overallPercentage = ((double) obtainedMarks / totalMarks) * 100.0;

                overallPercentage = Math.round(overallPercentage * 100.0) / 100.0;

                // =========================================================
                // SGPA
                // =========================================================

                double sgpa = totalCreditPoints / totalCredits;

                sgpa = Math.round(sgpa * 100.0) / 100.0;

                // =========================================================
                // DBATU SGPA-TO-PERCENTAGE CONVERSION
                // Formula: (SGPA × 10) − 0.75
                // =========================================================

                double cgpaPercentage = (sgpa - 0.5) * 10.0;

                cgpaPercentage = Math.round(cgpaPercentage * 100.0) / 100.0;

                // =========================================================
                // RESULT STATUS
                // =========================================================
                ResultStatus resultStatus = failed
                                ? ResultStatus.FAIL
                                : ResultStatus.PASS;

                // =========================================================
                // UPDATE RESULT
                // =========================================================
                result.setTotalMarks(totalMarks);
                result.setObtainedMarks(obtainedMarks);
                result.setPercentage(cgpaPercentage);
                result.setSgpa(sgpa);
                result.setCgpaPercentage(cgpaPercentage);
                result.setResultStatus(resultStatus);

                // =========================================================
                // SAVE UPDATED RESULT
                // =========================================================
                resultRepository.save(result);

                System.out.println("=================================");
                System.out.println("RESULT RECALCULATED SUCCESSFULLY");
                System.out.println("RESULT ID = " + result.getId());
                System.out.println("TOTAL MARKS = "
                                + obtainedMarks + "/" + totalMarks);
                System.out.println("PERCENTAGE = "
                                + cgpaPercentage);
                System.out.println("SGPA = "
                                + sgpa);
                System.out.println("STATUS = "
                                + resultStatus);
                System.out.println("=================================");
        }

        @Override
        public byte[] generateMarksheet(Long resultId) {

                Result result = resultRepository.findById(resultId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Result not found."));

                try {

                        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

                        Document document = new Document(PageSize.A4);

                        PdfWriter.getInstance(
                                        document,
                                        outputStream);

                        document.open();

                        // Fonts
                        Font titleFont = new Font(
                                        Font.HELVETICA,
                                        18,
                                        Font.BOLD);

                        Font headingFont = new Font(
                                        Font.HELVETICA,
                                        12,
                                        Font.BOLD);

                        Font normalFont = new Font(
                                        Font.HELVETICA,
                                        10);

                        // --------------------------------
                        // College / System Title
                        // --------------------------------

                        Paragraph title = new Paragraph(
                                        "STUDENT RESULT MANAGEMENT SYSTEM",
                                        titleFont);

                        title.setAlignment(
                                        Element.ALIGN_CENTER);

                        document.add(title);

                        Paragraph subtitle = new Paragraph(
                                        getExaminationTitle(result),
                                        headingFont);

                        subtitle.setAlignment(
                                        Element.ALIGN_CENTER);

                        document.add(subtitle);

                        subtitle.setAlignment(
                                        Element.ALIGN_CENTER);

                        document.add(subtitle);

                        document.add(
                                        new Paragraph(" "));

                        // --------------------------------
                        // Student Information
                        // --------------------------------

                        document.add(
                                        new Paragraph(
                                                        "Student Name: "
                                                                        + result.getStudent()
                                                                                        .getFirstName()
                                                                        + " "
                                                                        + result.getStudent()
                                                                                        .getLastName(),
                                                        normalFont));

                        document.add(
                                        new Paragraph(
                                                        "Roll Number: "
                                                                        + result.getStudent()
                                                                                        .getRollNo(),
                                                        normalFont));

                        document.add(
                                        new Paragraph(
                                                        "PRN Number: "
                                                                        + result.getStudent()
                                                                                        .getPrnNo(),
                                                        normalFont));

                        document.add(
                                        new Paragraph(
                                                        "Semester: "
                                                                        + result.getSemester()
                                                                                        .getSemesterName(),
                                                        normalFont));

                        document.add(
                                        new Paragraph(
                                                        "Course: "
                                                                        + result.getSemester()
                                                                                        .getCourse()
                                                                                        .getCourseName(),
                                                        normalFont));

                        document.add(
                                        new Paragraph(
                                                        "Department: "
                                                                        + result.getSemester()
                                                                                        .getCourse()
                                                                                        .getDepartment()
                                                                                        .getDepartmentName(),
                                                        normalFont));

                        document.add(
                                        new Paragraph(" "));

                        // --------------------------------
                        // Subject Table
                        // --------------------------------

                        PdfPTable table = new PdfPTable(8);

                        table.setWidthPercentage(100);

                        String[] headers = {
                                        "Code",
                                        "Subject",
                                        "Credits",
                                        "Total",
                                        "Obtained",
                                        "%",
                                        "Grade",
                                        "GP"
                        };

                        for (String header : headers) {

                                PdfPCell cell = new PdfPCell(
                                                new Phrase(
                                                                header,
                                                                headingFont));

                                cell.setHorizontalAlignment(
                                                Element.ALIGN_CENTER);

                                table.addCell(cell);
                        }

                        // --------------------------------
                        // Subject Data
                        // --------------------------------

                        for (ResultSubject rs : result.getResultSubjects()) {

                                table.addCell(
                                                rs.getSubject()
                                                                .getSubjectCode());

                                table.addCell(
                                                rs.getSubject()
                                                                .getSubjectName());

                                table.addCell(
                                                String.valueOf(
                                                                rs.getCredits()));

                                table.addCell(
                                                String.valueOf(
                                                                rs.getTotalMarks()));

                                table.addCell(
                                                String.valueOf(
                                                                rs.getObtainedMarks()));

                                table.addCell(
                                                String.valueOf(
                                                                rs.getPercentage()));

                                // DBATUGrade enum → String
                                table.addCell(
                                                rs.getGrade().name());

                                table.addCell(
                                                String.valueOf(
                                                                rs.getGradePoint()));
                        }

                        document.add(table);

                        document.add(
                                        new Paragraph(" "));

                        // --------------------------------
                        // Result Summary
                        // --------------------------------

                        document.add(
                                        new Paragraph(
                                                        "Total Marks: "
                                                                        + result.getTotalMarks(),
                                                        normalFont));

                        document.add(
                                        new Paragraph(
                                                        "Obtained Marks: "
                                                                        + result.getObtainedMarks(),
                                                        normalFont));

                        document.add(
                                        new Paragraph(
                                                        "Percentage: "
                                                                        + result.getPercentage()
                                                                        + "%",
                                                        normalFont));

                        document.add(
                                        new Paragraph(
                                                        "SGPA: "
                                                                        + result.getSgpa(),
                                                        normalFont));

                        document.add(
                                        new Paragraph(
                                                        "Result Status: "
                                                                        + result.getResultStatus(),
                                                        headingFont));

                        document.close();

                        return outputStream.toByteArray();

                } catch (Exception e) {

                        throw new RuntimeException(
                                        "Failed to generate marksheet PDF.",
                                        e);
                }
        }

        @Override
        public ApiResponse<CGPAResponse> getMyCGPA(String username) {

                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found."));

                Student student = studentRepository.findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Student not found."));

                return getStudentCGPA(student.getId());
        }

}