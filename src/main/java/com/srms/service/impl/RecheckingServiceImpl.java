package com.srms.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.srms.dto.request.RecheckingRequestDto;
import com.srms.dto.request.TeacherRecheckingCompleteRequest;
import com.srms.dto.request.TeacherRecheckingReviewRequest;

import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.RecheckingResponse;
import com.srms.dto.response.RecheckingSubjectResponse;

import com.srms.entity.Marks;
import com.srms.entity.RecheckingRequest;
import com.srms.entity.RecheckingSubject;
import com.srms.entity.ResultSubject;
import com.srms.entity.Student;
import com.srms.entity.Teacher;
import com.srms.entity.TeacherSubject;
import com.srms.entity.User;
import com.srms.enums.DBATUGrade;
import com.srms.enums.RecheckingResult;
import com.srms.enums.RecheckingStatus;
import com.srms.enums.ResultStatus;

import com.srms.exception.BadRequestException;
import com.srms.exception.ResourceNotFoundException;

import com.srms.repository.MarksRepository;
import com.srms.repository.RecheckingRequestRepository;
import com.srms.repository.RecheckingSubjectRepository;
import com.srms.repository.ResultSubjectRepository;
import com.srms.repository.StudentRepository;
import com.srms.repository.TeacherRepository;
import com.srms.repository.TeacherSubjectRepository;
import com.srms.repository.UserRepository;
import com.srms.service.EmailService;
import com.srms.service.GradeCalculationService;
import com.srms.service.NotificationService;
import com.srms.service.RecheckingService;
import com.srms.service.ResultService;

import jakarta.transaction.Transactional;

import java.util.ArrayList;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecheckingServiceImpl implements RecheckingService {

        private final RecheckingRequestRepository recheckingRequestRepository;

        private final ResultSubjectRepository resultSubjectRepository;

        private final StudentRepository studentRepository;

        private final UserRepository userRepository;

        private final TeacherSubjectRepository teacherSubjectRepository;

        private final RecheckingSubjectRepository recheckingSubjectRepository;

        private final TeacherRepository teacherRepository;
        private final MarksRepository marksRepository;
        private final ResultService resultService;
        private final EmailService emailService;
        private final GradeCalculationService gradeCalculationService;
        private final NotificationService notificationService;

        @Override
        @Transactional
        public ApiResponse<RecheckingResponse> applyForRechecking(
                        String username,
                        RecheckingRequestDto request) {

                // 1. Find logged-in user
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found."));

                // 2. Find student
                Student student = studentRepository.findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Student not found."));

                // 3. Validate selected subjects
                if (request.getResultSubjectIds() == null
                                || request.getResultSubjectIds().isEmpty()) {

                        throw new BadRequestException(
                                        "Please select at least one subject.");
                }

                // 4. Create parent rechecking request
                RecheckingRequest recheckingRequest = RecheckingRequest.builder()
                                .student(student)
                                .examType(request.getExamType())
                                .reason(request.getReason())
                                .status(RecheckingStatus.PENDING)
                                .appliedAt(LocalDateTime.now())
                                .build();

                // 5. Store email information
                List<String> subjectNames = new ArrayList<>();

                List<Teacher> assignedTeachers = new ArrayList<>();

                List<ResultSubject> selectedSubjects = new ArrayList<>();

                // 6. Process every selected subject
                for (Long resultSubjectId : request.getResultSubjectIds()) {

                        ResultSubject resultSubject = resultSubjectRepository
                                        .findById(resultSubjectId)
                                        .orElseThrow(() -> new ResourceNotFoundException(
                                                        "Result subject not found: "
                                                                        + resultSubjectId));

                        // 7. Verify result belongs to logged-in student
                        if (!resultSubject.getResult()
                                        .getStudent()
                                        .getId()
                                        .equals(student.getId())) {

                                throw new BadRequestException(
                                                "Selected subject does not belong to you.");
                        }

                        // 8. Find student's marks
                        Marks marks = marksRepository
                                        .findByStudentIdAndSubjectId(
                                                        student.getId(),
                                                        resultSubject
                                                                        .getSubject()
                                                                        .getId())
                                        .orElseThrow(() -> new ResourceNotFoundException(
                                                        "Marks record not found for subject."));

                        // 9. Find teacher assigned to subject
                        TeacherSubject teacherSubject = teacherSubjectRepository
                                        .findBySubjectId(
                                                        resultSubject
                                                                        .getSubject()
                                                                        .getId())
                                        .orElseThrow(() -> new ResourceNotFoundException(
                                                        "Teacher is not assigned to subject: "
                                                                        + resultSubject
                                                                                        .getSubject()
                                                                                        .getSubjectCode()));

                        Teacher teacher = teacherSubject.getTeacher();

                        // 10. Create subject-level rechecking record
                        RecheckingSubject recheckingSubject = RecheckingSubject.builder()
                                        .recheckingRequest(
                                                        recheckingRequest)
                                        .resultSubject(
                                                        resultSubject)
                                        .teacher(teacher)
                                        .oldMarks(
                                                        marks.getExternalMarks())
                                        .status(
                                                        RecheckingStatus.PENDING)
                                        .build();

                        // 11. Add subject to parent request
                        recheckingRequest
                                        .getSubjects()
                                        .add(recheckingSubject);

                        // 12. Collect email information
                        subjectNames.add(
                                        resultSubject
                                                        .getSubject()
                                                        .getSubjectName());

                        assignedTeachers.add(teacher);

                        selectedSubjects.add(resultSubject);
                }

                // 13. SAVE FIRST
                recheckingRequest = recheckingRequestRepository.save(
                                recheckingRequest);

                // 14. ONE email to student
                emailService.sendRecheckingAppliedEmail(
                                user.getEmail(),

                                student.getFirstName()
                                                + " "
                                                + student.getLastName(),

                                subjectNames);

                // 15. Send email + notification to each assigned teacher
                for (int i = 0; i < selectedSubjects.size(); i++) {

                        ResultSubject resultSubject = selectedSubjects.get(i);

                        Teacher teacher = assignedTeachers.get(i);

                        String subjectName = resultSubject
                                        .getSubject()
                                        .getSubjectName();

                        String studentName = student.getFirstName()
                                        + " "
                                        + student.getLastName();

                        // ================================
                        // SEND EMAIL TO TEACHER
                        // ================================
                        emailService.sendRecheckingAssignedEmail(
                                        teacher.getUser().getEmail(),

                                        teacher.getFirstName()
                                                        + " "
                                                        + teacher.getLastName(),

                                        studentName,

                                        subjectName);

                        // ================================
                        // SEND REAL-TIME NOTIFICATION
                        // ================================
                        notificationService.createNotification(
                                        teacher.getUser(),

                                        "New Rechecking Application",

                                        "A new rechecking application has been submitted by "
                                                        + studentName
                                                        + " for "
                                                        + subjectName
                                                        + ".",

                                        "RECHECKING_APPLICATION");
                }

                // 16. Return response
                return ApiResponse.<RecheckingResponse>builder()
                                .success(true)
                                .message(
                                                "Rechecking Request Submitted")
                                .data(
                                                toResponse(recheckingRequest))
                                .build();
        }

        @Override
        public ApiResponse<List<RecheckingResponse>> getMyRecheckingRequests(
                        String username) {

                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found."));

                Student student = studentRepository.findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Student not found."));

                List<RecheckingResponse> response = recheckingRequestRepository
                                .findByStudent(student)
                                .stream()
                                .map(this::toResponse)
                                .collect(Collectors.toList());

                return ApiResponse.<List<RecheckingResponse>>builder()
                                .success(true)
                                .message("My Rechecking Requests")
                                .data(response)
                                .build();
        }

        @Override
        @Transactional
        public ApiResponse<Void> cancelRechecking(
                        String username,
                        Long id) {

                User user = userRepository
                                .findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found."));

                Student student = studentRepository
                                .findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Student not found."));

                RecheckingRequest request = recheckingRequestRepository
                                .findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Rechecking request not found."));

                // Verify ownership
                if (request.getStudent() == null ||
                                !request.getStudent()
                                                .getId()
                                                .equals(student.getId())) {

                        throw new BadRequestException(
                                        "You are not allowed to cancel this request.");
                }

                // Only pending requests can be cancelled
                if (request.getStatus() != RecheckingStatus.PENDING) {

                        throw new BadRequestException(
                                        "Only pending rechecking requests can be cancelled.");
                }

                // Check applied time
                if (request.getAppliedAt() == null) {

                        throw new BadRequestException(
                                        "Request application time is not available.");
                }

                // 10-minute cancellation window
                LocalDateTime expiryTime = request.getAppliedAt()
                                .plusMinutes(10);

                if (!LocalDateTime.now()
                                .isBefore(expiryTime)) {

                        throw new BadRequestException(
                                        "Cancellation period has expired. "
                                                        + "A rechecking request can only be "
                                                        + "cancelled within 10 minutes.");
                }

                // Cancel parent request
                request.setStatus(
                                RecheckingStatus.CANCELLED);

                // Cancel pending subjects
                if (request.getSubjects() != null) {

                        request.getSubjects()
                                        .forEach(subject -> {

                                                if (subject.getStatus() == RecheckingStatus.PENDING) {

                                                        subject.setStatus(
                                                                        RecheckingStatus.CANCELLED);
                                                }

                                        });
                }

                // Cascade saves subjects automatically
                recheckingRequestRepository.save(request);

                return ApiResponse.<Void>builder()
                                .success(true)
                                .message(
                                                "Rechecking request cancelled successfully.")
                                .data(null)
                                .build();
        }

        private RecheckingResponse toResponse(
                        RecheckingRequest request) {

                Student student = request.getStudent();

                List<RecheckingSubjectResponse> subjects = request.getSubjects()
                                .stream()
                                .map(this::toSubjectResponse)
                                .collect(Collectors.toList());

                return RecheckingResponse.builder()
                                .id(request.getId())

                                .studentId(student.getId())

                                .studentName(
                                                student.getFirstName()
                                                                + " "
                                                                + student.getLastName())

                                .rollNo(student.getRollNo())

                                .prnNo(student.getPrnNo())

                                .email(student.getEmail())

                                .mobile(student.getMobile())

                                .departmentName(
                                                student.getSemester()
                                                                .getCourse()
                                                                .getDepartment()
                                                                .getDepartmentName())

                                .semesterName(
                                                student.getSemester()
                                                                .getSemesterName())

                                .examType(
                                                request.getExamType()
                                                                .name())

                                .reason(request.getReason())

                                .status(
                                                getOverallRecheckingStatus(request).name())

                                .appliedAt(request.getAppliedAt())

                                .reviewedAt(request.getReviewedAt())

                                .subjects(subjects)

                                .build();
        }

        private RecheckingStatus getOverallRecheckingStatus(
                        RecheckingRequest request) {

                if (request == null || request.getSubjects() == null
                                || request.getSubjects().isEmpty()) {

                        return request != null
                                        ? request.getStatus()
                                        : RecheckingStatus.PENDING;
                }

                List<RecheckingSubject> subjects = request.getSubjects();

                boolean hasPending = subjects.stream()
                                .anyMatch(subject -> subject.getStatus() == RecheckingStatus.PENDING);

                if (hasPending) {
                        return RecheckingStatus.PENDING;
                }

                boolean allRejected = subjects.stream()
                                .allMatch(subject -> subject.getStatus() == RecheckingStatus.REJECTED);

                if (allRejected) {
                        return RecheckingStatus.REJECTED;
                }

                boolean allCancelled = subjects.stream()
                                .allMatch(subject -> subject.getStatus() == RecheckingStatus.CANCELLED);

                if (allCancelled) {
                        return RecheckingStatus.CANCELLED;
                }

                boolean allCompleted = subjects.stream()
                                .allMatch(subject -> subject.getStatus() == RecheckingStatus.COMPLETED);

                if (allCompleted) {
                        return RecheckingStatus.COMPLETED;
                }

                boolean allApproved = subjects.stream()
                                .allMatch(subject -> subject.getStatus() == RecheckingStatus.APPROVED);

                if (allApproved) {
                        return RecheckingStatus.APPROVED;
                }

                return RecheckingStatus.PENDING;
        }

        private RecheckingSubjectResponse toSubjectResponse(
                        RecheckingSubject subject) {

                Teacher teacher = subject.getTeacher();

                Student student = subject
                                .getRecheckingRequest()
                                .getStudent();

                String studentName = student.getFirstName()
                                + " "
                                + student.getLastName();

                return RecheckingSubjectResponse.builder()

                                // ==========================================
                                // RECHECKING SUBJECT
                                // ==========================================

                                .id(subject.getId())

                                .resultSubjectId(
                                                subject.getResultSubject().getId())

                                // ==========================================
                                // STUDENT
                                // ==========================================

                                .studentId(
                                                student.getId())

                                .studentName(
                                                studentName)

                                .rollNo(
                                                student.getRollNo())

                                .prnNo(
                                                student.getPrnNo())

                                .enrollmentNo(
                                                student.getEnrollmentNo())

                                .semesterName(
                                                student.getSemester() != null
                                                                ? student.getSemester().getSemesterName()
                                                                : null)

                                // ==========================================
                                // RECHECKING REQUEST
                                // ==========================================

                                .examType(
                                                subject.getRecheckingRequest()
                                                                .getExamType() != null
                                                                                ? subject.getRecheckingRequest()
                                                                                                .getExamType()
                                                                                                .name()
                                                                                : null)

                                .reason(
                                                subject.getRecheckingRequest()
                                                                .getReason())

                                // ==========================================
                                // SUBJECT
                                // ==========================================

                                .subjectCode(
                                                subject.getResultSubject()
                                                                .getSubject()
                                                                .getSubjectCode())

                                .subjectName(
                                                subject.getResultSubject()
                                                                .getSubject()
                                                                .getSubjectName())

                                // ==========================================
                                // TEACHER
                                // ==========================================

                                .teacherId(
                                                teacher.getId())

                                .teacherName(
                                                teacher.getFirstName()
                                                                + " "
                                                                + teacher.getLastName())

                                // ==========================================
                                // MARKS
                                // ==========================================

                                .oldMarks(
                                                subject.getOldMarks())

                                .newMarks(
                                                subject.getNewMarks())

                                .teacherMessage(
                                                subject.getTeacherMessage())

                                // ==========================================
                                // STATUS
                                // ==========================================

                                .status(
                                                subject.getStatus() != null
                                                                ? subject.getStatus().name()
                                                                : null)

                                .reviewResult(
                                                subject.getReviewResult() != null
                                                                ? subject.getReviewResult().name()
                                                                : null)

                                .build();
        }

        @Override
        public ApiResponse<List<RecheckingSubjectResponse>> getTeacherRecheckingRequests(
                        String username) {

                // Find logged-in user
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found."));

                // Find teacher
                Teacher teacher = teacherRepository.findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Teacher not found."));

                // Find requests assigned to this teacher
                List<RecheckingSubjectResponse> response = recheckingSubjectRepository
                                .findByTeacher(teacher)
                                .stream()
                                .map(this::toSubjectResponse)
                                .collect(Collectors.toList());

                return ApiResponse.<List<RecheckingSubjectResponse>>builder()
                                .success(true)
                                .message("Teacher Rechecking Requests")
                                .data(response)
                                .build();
        }

        @Override
        public ApiResponse<RecheckingSubjectResponse> reviewRecheckingRequest(
                        String username,
                        Long recheckingSubjectId,
                        TeacherRecheckingReviewRequest request) {

                // 1. Find logged-in user
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found."));

                // 2. Find teacher
                Teacher teacher = teacherRepository.findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Teacher not found."));

                // 3. Find rechecking subject
                RecheckingSubject recheckingSubject = recheckingSubjectRepository
                                .findById(recheckingSubjectId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Rechecking request not found."));

                // 4. Security check
                // Only assigned teacher can review
                if (!recheckingSubject.getTeacher()
                                .getId()
                                .equals(teacher.getId())) {

                        throw new BadRequestException(
                                        "You are not assigned to this rechecking request.");
                }

                // 5. Request must be pending
                if (recheckingSubject.getStatus() != RecheckingStatus.PENDING) {

                        throw new BadRequestException(
                                        "This rechecking request has already been reviewed.");
                }

                // 6. Get student information
                Student student = recheckingSubject
                                .getRecheckingRequest()
                                .getStudent();

                String studentName = student.getFirstName()
                                + " "
                                + student.getLastName();

                String subjectName = recheckingSubject
                                .getResultSubject()
                                .getSubject()
                                .getSubjectName();

                // 7. Update status
                if (request.getApproved()) {

                        recheckingSubject.setStatus(
                                        RecheckingStatus.APPROVED);

                } else {

                        recheckingSubject.setStatus(
                                        RecheckingStatus.REJECTED);
                }

                // 8. Set review time
                recheckingSubject.setReviewedAt(
                                LocalDateTime.now());

                // 9. Save
                recheckingSubject = recheckingSubjectRepository.save(
                                recheckingSubject);

                // 10. Send email + notification to student
                if (request.getApproved()) {

                        // ================================
                        // APPROVED EMAIL
                        // ================================
                        emailService.sendRecheckingApprovedEmail(
                                        student.getUser().getEmail(),
                                        studentName,
                                        subjectName);

                        // ================================
                        // APPROVED NOTIFICATION
                        // ================================
                        notificationService.createNotification(
                                        student.getUser(),

                                        "Rechecking Approved",

                                        "Your rechecking application for "
                                                        + subjectName
                                                        + " has been approved by the teacher.",

                                        "RECHECKING_APPROVED");

                } else {

                        // ================================
                        // REJECTED EMAIL
                        // ================================
                        String reason = recheckingSubject
                                        .getRecheckingRequest()
                                        .getReason();

                        emailService.sendRecheckingRejectedEmail(
                                        student.getUser().getEmail(),
                                        studentName,
                                        subjectName,
                                        reason);

                        // ================================
                        // REJECTED NOTIFICATION
                        // ================================
                        notificationService.createNotification(
                                        student.getUser(),

                                        "Rechecking Rejected",

                                        "Your rechecking application for "
                                                        + subjectName
                                                        + " has been rejected by the teacher.",

                                        "RECHECKING_REJECTED");
                }

                // 11. Return response
                return ApiResponse.<RecheckingSubjectResponse>builder()
                                .success(true)
                                .message(
                                                request.getApproved()
                                                                ? "Rechecking request approved."
                                                                : "Rechecking request rejected.")
                                .data(
                                                toSubjectResponse(
                                                                recheckingSubject))
                                .build();
        }

        @Override
        @Transactional
        public ApiResponse<RecheckingSubjectResponse> completeRechecking(
                        String username,
                        Long recheckingSubjectId,
                        TeacherRecheckingCompleteRequest request) {

                // ==========================================
                // 1. FIND LOGGED-IN USER
                // ==========================================

                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found."));

                // ==========================================
                // 2. FIND TEACHER
                // ==========================================

                Teacher teacher = teacherRepository.findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Teacher not found."));

                // ==========================================
                // 3. FIND RECHECKING SUBJECT
                // ==========================================

                RecheckingSubject recheckingSubject = recheckingSubjectRepository.findById(recheckingSubjectId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Rechecking request not found."));

                // ==========================================
                // 4. VERIFY TEACHER
                // ==========================================

                if (!recheckingSubject.getTeacher()
                                .getId()
                                .equals(teacher.getId())) {

                        throw new BadRequestException(
                                        "You are not assigned to this rechecking request.");
                }

                // ==========================================
                // 5. REQUEST MUST BE APPROVED
                // ==========================================

                if (recheckingSubject.getStatus() != RecheckingStatus.APPROVED) {

                        throw new BadRequestException(
                                        "Rechecking request must be approved first.");
                }

                // ==========================================
                // 6. FIND RESULT SUBJECT
                // ==========================================

                ResultSubject resultSubject = recheckingSubject.getResultSubject();

                // ==========================================
                // 7. FIND EXISTING MARKS
                // ==========================================

                Marks marks = marksRepository
                                .findByStudentIdAndSubjectId(
                                                resultSubject
                                                                .getResult()
                                                                .getStudent()
                                                                .getId(),

                                                resultSubject
                                                                .getSubject()
                                                                .getId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Marks record not found."));

                // ==========================================
                // 8. GET OLD MARKS
                // ==========================================

                Integer oldExternalMarks = marks.getExternalMarks();

                Integer newExternalMarks = oldExternalMarks;

                // ==========================================
                // 9. CHECK REVIEW RESULT
                // ==========================================

                if ("NO_CHANGE".equalsIgnoreCase(
                                request.getReviewResult())) {

                        // ==========================================
                        // NO CHANGE
                        // ==========================================

                        if (request.getTeacherMessage() == null
                                        || request.getTeacherMessage()
                                                        .trim()
                                                        .isEmpty()) {

                                throw new BadRequestException(
                                                "Please provide a message explaining why marks were not increased.");
                        }

                        // Keep old marks
                        recheckingSubject.setNewMarks(
                                        oldExternalMarks);

                        // Set review result
                        recheckingSubject.setReviewResult(
                                        RecheckingResult.NO_CHANGE);

                        // Teacher message
                        recheckingSubject.setTeacherMessage(
                                        request.getTeacherMessage()
                                                        .trim());

                } else if ("MARKS_INCREASED".equalsIgnoreCase(
                                request.getReviewResult())) {

                        // ==========================================
                        // MARKS INCREASED
                        // ==========================================

                        newExternalMarks = request.getNewMarks();

                        // New marks required
                        if (newExternalMarks == null) {

                                throw new BadRequestException(
                                                "New external marks are required when marks are increased.");
                        }

                        // Cannot be negative
                        if (newExternalMarks < 0) {

                                throw new BadRequestException(
                                                "External marks cannot be negative.");
                        }

                        // Cannot exceed subject maximum
                        if (newExternalMarks > marks.getSubject().getExternalMaxMarks()) {

                                throw new BadRequestException(
                                                "External marks cannot be greater than "
                                                                + marks.getSubject()
                                                                                .getExternalMaxMarks());
                        }

                        // Must actually increase
                        if (newExternalMarks <= oldExternalMarks) {

                                throw new BadRequestException(
                                                "New marks must be greater than old marks.");
                        }

                        // ==========================================
                        // UPDATE EXTERNAL MARKS
                        // ==========================================

                        marks.setExternalMarks(
                                        newExternalMarks);

                        // ==========================================
                        // RECALCULATE TOTAL
                        // ==========================================

                        Integer newTotal = marks.getInternalMarks()
                                        + newExternalMarks;

                        marks.setTotalMarks(newTotal);

                        // ==========================================
                        // RECALCULATE GRADE
                        // ==========================================

                        DBATUGrade grade = gradeCalculationService
                                        .calculateGrade(newTotal);

                        marks.setGrade(grade);

                        // ==========================================
                        // RECALCULATE SUBJECT RESULT STATUS
                        // ==========================================

                        ResultStatus resultStatus = newTotal >= marks.getSubject()
                                        .getPassingMarks()
                                                        ? ResultStatus.PASS
                                                        : ResultStatus.FAIL;

                        marks.setResultStatus(resultStatus);

                        // ==========================================
                        // SAVE UPDATED MARKS
                        // ==========================================

                        marksRepository.save(marks);

                        // ==========================================
                        // RECALCULATE COMPLETE RESULT + SGPA
                        // ==========================================

                        resultService.recalculateResult(
                                        resultSubject
                                                        .getResult()
                                                        .getId());

                        // ==========================================
                        // STORE RECHECKING RESULT
                        // ==========================================

                        recheckingSubject.setNewMarks(
                                        newExternalMarks);

                        recheckingSubject.setReviewResult(
                                        RecheckingResult.MARKS_INCREASED);

                        // Teacher message
                        recheckingSubject.setTeacherMessage(
                                        request.getTeacherMessage());

                } else {

                        // ==========================================
                        // INVALID REVIEW RESULT
                        // ==========================================

                        throw new BadRequestException(
                                        "Invalid review result.");
                }

                // ==========================================
                // 12. COMPLETE RECHECKING
                // ==========================================

                recheckingSubject.setStatus(
                                RecheckingStatus.COMPLETED);

                recheckingSubject.setReviewedAt(
                                LocalDateTime.now());

                // ==========================================
                // 13. SAVE RECHECKING RESULT
                // ==========================================

                recheckingSubject = recheckingSubjectRepository.save(
                                recheckingSubject);

                // ==========================================
                // 14. GET STUDENT INFORMATION
                // ==========================================

                Student student = resultSubject
                                .getResult()
                                .getStudent();

                String studentName = student.getFirstName()
                                + " "
                                + student.getLastName();

                String subjectName = resultSubject
                                .getSubject()
                                .getSubjectName();

                // ==========================================
                // 15. CREATE STUDENT NOTIFICATION
                // ==========================================

                if (recheckingSubject.getReviewResult() == RecheckingResult.MARKS_INCREASED) {

                        notificationService.createNotification(
                                        student.getUser(),
                                        "Result Updated",
                                        "Your marks for "
                                                        + subjectName
                                                        + " have been increased after rechecking. "
                                                        + "Your result has been updated successfully.",
                                        "RESULT_UPDATED");

                } else {

                        notificationService.createNotification(
                                        student.getUser(),
                                        "Rechecking Completed",
                                        "Your rechecking request for "
                                                        + subjectName
                                                        + " has been completed. "
                                                        + "There is no change in your marks.",
                                        "RECHECKING_COMPLETED");
                }

                // ==========================================
                // 16. SEND COMPLETION EMAIL
                // ==========================================

                emailService.sendRecheckingCompletedEmail(
                                student.getUser().getEmail(),
                                studentName,
                                subjectName,
                                oldExternalMarks,
                                newExternalMarks);

                // ==========================================
                // 17. RETURN RESPONSE
                // ==========================================

                return ApiResponse
                                .<RecheckingSubjectResponse>builder()
                                .success(true)
                                .message(
                                                recheckingSubject.getReviewResult() == RecheckingResult.MARKS_INCREASED
                                                                ? "Marks increased and updated successfully."
                                                                : "Rechecking completed. No change in marks.")
                                .data(
                                                toSubjectResponse(
                                                                recheckingSubject))
                                .build();
        }

        @Override
        @Transactional
        public ApiResponse<String> deleteRecheckingRequest(
                        String username,
                        Long id) {

                RecheckingSubject subject = recheckingSubjectRepository
                                .findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Rechecking request not found."));

                // Only the assigned teacher can delete it
                User user = userRepository
                                .findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found."));

                Teacher teacher = teacherRepository
                                .findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Teacher not found."));

                if (!subject.getTeacher().getId()
                                .equals(teacher.getId())) {

                        throw new IllegalArgumentException(
                                        "You are not authorized to delete this request.");
                }

                // Delete the subject/request
                recheckingSubjectRepository.delete(subject);

                return ApiResponse
                                .<String>builder()
                                .success(true)
                                .message("Rechecking request deleted successfully.")
                                .data("Deleted successfully")
                                .build();
        }

        // =====================================================
        // ADMIN - GET ALL RECHECKING REQUESTS
        // =====================================================

        @Override
        @Transactional
        public ApiResponse<List<RecheckingResponse>> getAllRecheckingRequests() {

                List<RecheckingResponse> response = recheckingRequestRepository.findAll()
                                .stream()
                                .map(this::toResponse)
                                .collect(Collectors.toList());

                return ApiResponse.<List<RecheckingResponse>>builder()
                                .success(true)
                                .message("All Rechecking Requests")
                                .data(response)
                                .build();
        }

        // =====================================================
        // ADMIN - GET RECHECKING REQUEST BY ID
        // =====================================================

        @Override
        @Transactional
        public ApiResponse<RecheckingResponse> getRecheckingRequestById(
                        Long id) {

                RecheckingRequest request = recheckingRequestRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Rechecking request not found."));

                return ApiResponse.<RecheckingResponse>builder()
                                .success(true)
                                .message("Rechecking Request Details")
                                .data(toResponse(request))
                                .build();
        }
}