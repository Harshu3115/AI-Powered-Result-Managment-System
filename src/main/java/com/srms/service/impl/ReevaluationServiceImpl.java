package com.srms.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.srms.dto.request.ReevaluationRequestDto;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.ReevaluationResponse;
import com.srms.dto.response.ReevaluationSubjectResponse;

import com.srms.entity.Marks;
import com.srms.entity.ReevaluationRequest;
import com.srms.entity.ReevaluationSubject;
import com.srms.entity.ResultSubject;
import com.srms.entity.Student;
import com.srms.entity.Teacher;
import com.srms.entity.TeacherSubject;
import com.srms.entity.User;

import com.srms.enums.DBATUGrade;
import com.srms.enums.Grade;
import com.srms.enums.ReevaluationResult;
import com.srms.enums.ReevaluationStatus;
import com.srms.enums.ResultStatus;

import com.srms.exception.BadRequestException;
import com.srms.exception.ResourceNotFoundException;

import com.srms.repository.MarksRepository;
import com.srms.repository.ReevaluationRequestRepository;
import com.srms.repository.ReevaluationSubjectRepository;
import com.srms.repository.ResultSubjectRepository;
import com.srms.repository.StudentRepository;
import com.srms.repository.TeacherRepository;
import com.srms.repository.TeacherSubjectRepository;
import com.srms.repository.UserRepository;
import com.srms.service.GradeCalculationService;
import com.srms.service.ReevaluationService;
import com.srms.service.ResultService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReevaluationServiceImpl implements ReevaluationService {

        private final ReevaluationRequestRepository reevaluationRequestRepository;

        private final ReevaluationSubjectRepository reevaluationSubjectRepository;

        private final ResultSubjectRepository resultSubjectRepository;

        private final StudentRepository studentRepository;

        private final UserRepository userRepository;

        private final TeacherSubjectRepository teacherSubjectRepository;

        private final TeacherRepository teacherRepository;

        private final MarksRepository marksRepository;

        private final ResultService resultService;

        private final GradeCalculationService gradeCalculationService;

        // =========================================================
        // STUDENT - APPLY FOR REEVALUATION
        // =========================================================

        @Override
        @Transactional
        public ApiResponse<ReevaluationResponse> applyForReevaluation(
                        String username,
                        ReevaluationRequestDto request) {

                // 1. Find logged-in user
                User user = userRepository
                                .findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found."));

                // 2. Find student
                Student student = studentRepository
                                .findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Student not found."));

                // 3. Validate subjects
                if (request.getResultSubjectIds() == null
                                || request.getResultSubjectIds().isEmpty()) {

                        throw new BadRequestException(
                                        "Please select at least one subject.");
                }

                // 4. Create parent request
                ReevaluationRequest reevaluationRequest = ReevaluationRequest.builder()
                                .student(student)
                                .examType(request.getExamType())
                                .reason(request.getReason())
                                .status(ReevaluationStatus.PENDING)
                                .appliedAt(LocalDateTime.now())
                                .build();

                // 5. Process selected subjects
                for (Long resultSubjectId : request.getResultSubjectIds()) {

                        // Find result subject
                        ResultSubject resultSubject = resultSubjectRepository
                                        .findById(resultSubjectId)
                                        .orElseThrow(() -> new ResourceNotFoundException(
                                                        "Result subject not found: "
                                                                        + resultSubjectId));

                        // 6. Verify ownership
                        if (!resultSubject.getResult()
                                        .getStudent()
                                        .getId()
                                        .equals(student.getId())) {

                                throw new BadRequestException(
                                                "Selected subject does not belong to you.");
                        }

                        // 7. Find existing marks
                        Marks marks = marksRepository
                                        .findByStudentIdAndSubjectId(
                                                        student.getId(),
                                                        resultSubject
                                                                        .getSubject()
                                                                        .getId())
                                        .orElseThrow(() -> new ResourceNotFoundException(
                                                        "Marks record not found for subject."));

                        // 8. Find teacher assigned to subject
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

                        // 9. Create subject-level request
                        ReevaluationSubject reevaluationSubject = ReevaluationSubject.builder()
                                        .reevaluationRequest(
                                                        reevaluationRequest)
                                        .resultSubject(
                                                        resultSubject)
                                        .teacher(teacher)
                                        .oldMarks(
                                                        marks.getExternalMarks())
                                        .status(
                                                        ReevaluationStatus.PENDING)
                                        .build();

                        // 10. Add to parent
                        reevaluationRequest
                                        .getSubjects()
                                        .add(reevaluationSubject);
                }

                // 11. Save parent
                // 11. Save parent first
                reevaluationRequest = reevaluationRequestRepository
                                .save(reevaluationRequest);

                // 12. Save all subject-level reevaluation records
                if (reevaluationRequest.getSubjects() != null
                                && !reevaluationRequest.getSubjects().isEmpty()) {

                        reevaluationSubjectRepository.saveAll(
                                        reevaluationRequest.getSubjects());
                }

                // 12. Return response
                return ApiResponse
                                .<ReevaluationResponse>builder()
                                .success(true)
                                .message(
                                                "Reevaluation Request Submitted")
                                .data(
                                                toResponse(
                                                                reevaluationRequest))
                                .build();
        }

        // =========================================================
        // STUDENT - MY REQUESTS
        // =========================================================

        @Override
        public ApiResponse<List<ReevaluationResponse>> getMyReevaluationRequests(String username) {

                User user = userRepository
                                .findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found."));

                Student student = studentRepository
                                .findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Student not found."));

                List<ReevaluationResponse> response = reevaluationRequestRepository
                                .findByStudent(student)
                                .stream()
                                .map(this::toResponse)
                                .collect(Collectors.toList());

                return ApiResponse
                                .<List<ReevaluationResponse>>builder()
                                .success(true)
                                .message(
                                                "My Reevaluation Requests")
                                .data(response)
                                .build();
        }

        // =========================================================
        // STUDENT - CANCEL
        // =========================================================

        @Override
        @Transactional
        public ApiResponse<Void> cancelReevaluation(
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

                ReevaluationRequest request = reevaluationRequestRepository
                                .findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Reevaluation request not found."));

                // Verify ownership
                if (request.getStudent() == null
                                || !request.getStudent()
                                                .getId()
                                                .equals(student.getId())) {

                        throw new BadRequestException(
                                        "You are not allowed to cancel this request.");
                }

                // Only pending
                if (request.getStatus() != ReevaluationStatus.PENDING) {

                        throw new BadRequestException(
                                        "Only pending reevaluation requests can be cancelled.");
                }

                // Check application time
                if (request.getAppliedAt() == null) {

                        throw new BadRequestException(
                                        "Request application time is not available.");
                }

                // 10-minute window
                LocalDateTime expiryTime = request.getAppliedAt()
                                .plusMinutes(10);

                if (!LocalDateTime.now()
                                .isBefore(expiryTime)) {

                        throw new BadRequestException(
                                        "Cancellation period has expired. "
                                                        + "A reevaluation request can only be "
                                                        + "cancelled within 10 minutes.");
                }

                // Cancel parent
                request.setStatus(
                                ReevaluationStatus.CANCELLED);

                // Cancel pending subjects
                if (request.getSubjects() != null) {

                        request.getSubjects()
                                        .forEach(subject -> {

                                                if (subject.getStatus() == ReevaluationStatus.PENDING) {

                                                        subject.setStatus(
                                                                        ReevaluationStatus.CANCELLED);
                                                }
                                        });
                }

                reevaluationRequestRepository
                                .save(request);

                return ApiResponse
                                .<Void>builder()
                                .success(true)
                                .message(
                                                "Reevaluation request cancelled successfully.")
                                .data(null)
                                .build();
        }

        // =========================================================
        // TEACHER - GET REQUESTS
        // =========================================================

        @Override
        public ApiResponse<List<ReevaluationSubjectResponse>> getTeacherReevaluationRequests(
                        String username) {

                User user = userRepository
                                .findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found."));

                Teacher teacher = teacherRepository
                                .findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Teacher not found."));

                List<ReevaluationSubjectResponse> response = reevaluationSubjectRepository
                                .findByTeacher(teacher)
                                .stream()
                                .map(this::toSubjectResponse)
                                .collect(Collectors.toList());

                return ApiResponse
                                .<List<ReevaluationSubjectResponse>>builder()
                                .success(true)
                                .message(
                                                "Teacher Reevaluation Requests")
                                .data(response)
                                .build();
        }

        // =========================================================
        // TEACHER - REVIEW
        // =========================================================

        @Override
        @Transactional
        public ApiResponse<ReevaluationSubjectResponse> reviewReevaluationRequest(
                        String username,
                        Long reevaluationSubjectId,
                        String reviewResult) {

                User user = userRepository
                                .findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found."));

                Teacher teacher = teacherRepository
                                .findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Teacher not found."));

                ReevaluationSubject subject = reevaluationSubjectRepository
                                .findById(reevaluationSubjectId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Reevaluation request not found."));

                // Verify assigned teacher
                if (subject.getTeacher() == null
                                || !subject.getTeacher()
                                                .getId()
                                                .equals(teacher.getId())) {

                        throw new BadRequestException(
                                        "You are not assigned to this reevaluation request.");
                }

                // Must be pending
                if (subject.getStatus() != ReevaluationStatus.PENDING) {

                        throw new BadRequestException(
                                        "This reevaluation request has already been reviewed.");
                }

                if (reviewResult == null
                                || reviewResult.trim().isEmpty()) {

                        throw new BadRequestException(
                                        "Review result is required.");
                }

                // APPROVED / REJECTED
                if (reviewResult.equalsIgnoreCase("APPROVED")) {

                        subject.setStatus(
                                        ReevaluationStatus.APPROVED);

                } else if (reviewResult.equalsIgnoreCase("REJECTED")) {

                        subject.setStatus(
                                        ReevaluationStatus.REJECTED);

                } else {

                        throw new BadRequestException(
                                        "Review result must be APPROVED or REJECTED.");
                }

                subject = reevaluationSubjectRepository
                                .save(subject);

                return ApiResponse
                                .<ReevaluationSubjectResponse>builder()
                                .success(true)
                                .message(
                                                reviewResult.equalsIgnoreCase("APPROVED")
                                                                ? "Reevaluation request approved."
                                                                : "Reevaluation request rejected.")
                                .data(
                                                toSubjectResponse(subject))
                                .build();
        }

        // =========================================================
        // TEACHER - COMPLETE
        // =========================================================

        @Override
        @Transactional
        public ApiResponse<ReevaluationSubjectResponse> completeReevaluation(
                        String username,
                        Long reevaluationSubjectId,
                        Integer newMarks,
                        String reviewResult) {

                // =========================================================
                // 1. FIND TEACHER
                // =========================================================

                User user = userRepository
                                .findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

                Teacher teacher = teacherRepository
                                .findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found."));

                // =========================================================
                // 2. FIND REEVALUATION SUBJECT
                // =========================================================

                ReevaluationSubject reevaluationSubject = reevaluationSubjectRepository
                                .findById(reevaluationSubjectId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Reevaluation request not found."));

                // =========================================================
                // 3. VERIFY TEACHER
                // =========================================================

                if (reevaluationSubject.getTeacher() == null
                                || !reevaluationSubject.getTeacher()
                                                .getId()
                                                .equals(teacher.getId())) {

                        throw new BadRequestException(
                                        "You are not assigned to this reevaluation request.");
                }

                // =========================================================
                // 4. REQUEST MUST BE APPROVED
                // =========================================================

                if (reevaluationSubject.getStatus() != ReevaluationStatus.APPROVED) {

                        throw new BadRequestException(
                                        "Reevaluation request must be approved first.");
                }

                // =========================================================
                // 5. VALIDATE REVIEW RESULT
                // =========================================================

                if (reviewResult == null
                                || reviewResult.trim().isEmpty()) {

                        throw new BadRequestException(
                                        "Review result is required.");
                }

                ReevaluationResult reevaluationResult;

                try {

                        reevaluationResult = ReevaluationResult.valueOf(
                                        reviewResult
                                                        .trim()
                                                        .toUpperCase());

                } catch (IllegalArgumentException e) {

                        throw new BadRequestException(
                                        "Review result must be MARKS_INCREASED or NO_CHANGE.");
                }

                // =========================================================
                // 6. GET RESULT SUBJECT
                // =========================================================

                ResultSubject resultSubject = reevaluationSubject.getResultSubject();

                if (resultSubject == null) {

                        throw new ResourceNotFoundException(
                                        "Result subject not found.");
                }

                // =========================================================
                // 7. FIND MARKS
                // =========================================================

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

                // =========================================================
                // 8. OLD EXTERNAL MARKS
                // =========================================================

                Integer oldExternalMarks = marks.getExternalMarks();

                if (oldExternalMarks == null) {

                        throw new BadRequestException(
                                        "Old marks are not available.");
                }

                // =========================================================
                // 9. MARKS INCREASED
                // =========================================================

                if (reevaluationResult == ReevaluationResult.MARKS_INCREASED) {

                        // New marks required
                        if (newMarks == null) {

                                throw new BadRequestException(
                                                "New marks are required when marks are increased.");
                        }

                        // Cannot be negative
                        if (newMarks < 0) {

                                throw new BadRequestException(
                                                "Marks cannot be negative.");
                        }

                        // Cannot exceed maximum external marks
                        if (newMarks > marks.getSubject().getExternalMaxMarks()) {

                                throw new BadRequestException(
                                                "External marks cannot be greater than "
                                                                + marks.getSubject()
                                                                                .getExternalMaxMarks());
                        }

                        // Must be greater than old marks
                        if (newMarks <= oldExternalMarks) {

                                throw new BadRequestException(
                                                "New marks must be greater than old marks.");
                        }

                } else {

                        // =====================================================
                        // NO CHANGE
                        // =====================================================

                        newMarks = oldExternalMarks;
                }

                // =========================================================
                // 10. UPDATE MARKS TABLE
                // =========================================================

                marks.setExternalMarks(newMarks);

                Integer internalMarks = marks.getInternalMarks() == null
                                ? 0
                                : marks.getInternalMarks();

                Integer newTotal = internalMarks + newMarks;

                marks.setTotalMarks(newTotal);

                // =========================================================
                // 11. RECALCULATE GRADE
                // =========================================================

                DBATUGrade grade = gradeCalculationService.calculateGrade(newTotal);

                marks.setGrade(grade);

                // =========================================================
                // 12. RECALCULATE RESULT STATUS
                // =========================================================

                ResultStatus resultStatus = newTotal >= marks.getSubject().getPassingMarks()
                                ? ResultStatus.PASS
                                : ResultStatus.FAIL;

                marks.setResultStatus(resultStatus);

                // =========================================================
                // 13. SAVE MARKS
                // =========================================================

                marksRepository.save(marks);

                // =========================================================
                // 14. EXPLICITLY UPDATE RESULT SUBJECT
                // =========================================================

                Integer subjectTotal = marks.getSubject().getInternalMaxMarks()
                                + marks.getSubject().getExternalMaxMarks();

                double percentage = ((double) newTotal / subjectTotal) * 100.0;

                percentage = Math.round(percentage * 100.0) / 100.0;

                resultSubject.setTotalMarks(subjectTotal);

                resultSubject.setObtainedMarks(newTotal);

                resultSubject.setPercentage(percentage);

                resultSubject.setGrade(grade);

                resultSubject.setGradePoint(
                                gradeCalculationService.getGradePoint(grade));

                resultSubjectRepository.save(resultSubject);

                // =========================================================
                // 15. RECALCULATE COMPLETE RESULT + SGPA
                // =========================================================

                resultService.recalculateResult(
                                resultSubject
                                                .getResult()
                                                .getId());

                // =========================================================
                // 16. STORE REEVALUATION RESULT
                // =========================================================

                reevaluationSubject.setNewMarks(newMarks);

                reevaluationSubject.setReviewResult(
                                reevaluationResult);

                reevaluationSubject.setStatus(
                                ReevaluationStatus.COMPLETED);

                reevaluationSubject.setReviewedAt(
                                LocalDateTime.now());

                // =========================================================
                // 17. SAVE REEVALUATION
                // =========================================================

                reevaluationSubject = reevaluationSubjectRepository.save(
                                reevaluationSubject);

                // =========================================================
                // 18. RETURN RESPONSE
                // =========================================================

                return ApiResponse
                                .<ReevaluationSubjectResponse>builder()
                                .success(true)
                                .message(
                                                reevaluationResult == ReevaluationResult.MARKS_INCREASED
                                                                ? "Marks increased and updated successfully."
                                                                : "Reevaluation completed. No change in marks.")
                                .data(
                                                toSubjectResponse(
                                                                reevaluationSubject))
                                .build();
        }

        // =========================================================
        // RESPONSE MAPPER
        // =========================================================

        private ReevaluationResponse toResponse(
                        ReevaluationRequest request) {

                Student student = request.getStudent();

                List<ReevaluationSubjectResponse> subjects = request.getSubjects()
                                .stream()
                                .map(this::toSubjectResponse)
                                .collect(Collectors.toList());

                return ReevaluationResponse
                                .builder()
                                .id(request.getId())

                                .studentId(
                                                student.getId())

                                .studentName(
                                                student.getFirstName()
                                                                + " "
                                                                + student.getLastName())

                                .rollNo(
                                                student.getRollNo())

                                .prnNo(
                                                student.getPrnNo())

                                .email(
                                                student.getEmail())

                                .mobile(
                                                student.getMobile())

                                .departmentName(
                                                student.getSemester()
                                                                .getCourse()
                                                                .getDepartment()
                                                                .getDepartmentName())

                                .semesterName(
                                                student.getSemester()
                                                                .getSemesterName())

                                .examType(
                                                request.getExamType() != null
                                                                ? request.getExamType().name()
                                                                : null)

                                .reason(
                                                request.getReason())

                                .status(
                                                getOverallReevaluationStatus(request).name())

                                .appliedAt(
                                                request.getAppliedAt())

                                .reviewedAt(
                                                request.getReviewedAt())

                                .subjects(subjects)

                                .build();
        }

        private ReevaluationStatus getOverallReevaluationStatus(
                        ReevaluationRequest request) {

                if (request == null
                                || request.getSubjects() == null
                                || request.getSubjects().isEmpty()) {

                        return request != null
                                        && request.getStatus() != null
                                                        ? request.getStatus()
                                                        : ReevaluationStatus.PENDING;
                }

                List<ReevaluationSubject> subjects = request.getSubjects();

                // If any subject is still pending
                boolean hasPending = subjects.stream()
                                .anyMatch(subject -> subject.getStatus() == ReevaluationStatus.PENDING);

                if (hasPending) {
                        return ReevaluationStatus.PENDING;
                }

                // All rejected
                boolean allRejected = subjects.stream()
                                .allMatch(subject -> subject.getStatus() == ReevaluationStatus.REJECTED);

                if (allRejected) {
                        return ReevaluationStatus.REJECTED;
                }

                // All cancelled
                boolean allCancelled = subjects.stream()
                                .allMatch(subject -> subject.getStatus() == ReevaluationStatus.CANCELLED);

                if (allCancelled) {
                        return ReevaluationStatus.CANCELLED;
                }

                // All completed
                boolean allCompleted = subjects.stream()
                                .allMatch(subject -> subject.getStatus() == ReevaluationStatus.COMPLETED);

                if (allCompleted) {
                        return ReevaluationStatus.COMPLETED;
                }

                // All approved
                boolean allApproved = subjects.stream()
                                .allMatch(subject -> subject.getStatus() == ReevaluationStatus.APPROVED);

                if (allApproved) {
                        return ReevaluationStatus.APPROVED;
                }

                return ReevaluationStatus.PENDING;
        }

        private ReevaluationSubjectResponse toSubjectResponse(
                        ReevaluationSubject subject) {

                Teacher teacher = subject.getTeacher();

                return ReevaluationSubjectResponse
                                .builder()

                                .id(
                                                subject.getId())

                                .resultSubjectId(
                                                subject
                                                                .getResultSubject()
                                                                .getId())

                                .subjectCode(
                                                subject
                                                                .getResultSubject()
                                                                .getSubject()
                                                                .getSubjectCode())

                                .subjectName(
                                                subject
                                                                .getResultSubject()
                                                                .getSubject()
                                                                .getSubjectName())

                                .teacherId(
                                                teacher != null
                                                                ? teacher.getId()
                                                                : null)

                                .teacherName(
                                                teacher != null
                                                                ? teacher.getFirstName()
                                                                                + " "
                                                                                + teacher.getLastName()
                                                                : null)

                                .oldMarks(
                                                subject.getOldMarks())

                                .newMarks(
                                                subject.getNewMarks())

                                .status(
                                                subject.getStatus() != null
                                                                ? subject
                                                                                .getStatus()
                                                                                .name()
                                                                : null)

                                .reviewResult(
                                                subject.getReviewResult() != null
                                                                ? subject.getReviewResult().name()
                                                                : null)

                                .reviewedAt(
                                                subject.getReviewedAt())

                                .build();
        }

        @Override
        @Transactional
        public ApiResponse<Void> deleteReevaluationRequest(
                        String username,
                        Long reevaluationSubjectId) {

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
                // FIND REEVALUATION SUBJECT
                // =========================================================

                ReevaluationSubject subject = reevaluationSubjectRepository
                                .findById(reevaluationSubjectId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Reevaluation request not found."));

                // =========================================================
                // VERIFY ASSIGNED TEACHER
                // =========================================================

                if (subject.getTeacher() == null ||
                                !subject.getTeacher()
                                                .getId()
                                                .equals(teacher.getId())) {

                        throw new BadRequestException(
                                        "You are not assigned to this reevaluation request.");
                }

                // =========================================================
                // DELETE REEVALUATION SUBJECT
                // =========================================================

                reevaluationSubjectRepository.delete(subject);

                // =========================================================
                // RESPONSE
                // =========================================================

                return ApiResponse
                                .<Void>builder()
                                .success(true)
                                .message("Reevaluation request deleted successfully.")
                                .data(null)
                                .build();
        }

        // =========================================================
        // ADMIN - GET ALL REEVALUATION REQUESTS
        // =========================================================

        @Override
        @Transactional
        public ApiResponse<List<ReevaluationResponse>> getAllReevaluationRequests() {

                List<ReevaluationResponse> response = reevaluationRequestRepository
                                .findAll()
                                .stream()
                                .map(this::toResponse)
                                .collect(Collectors.toList());

                return ApiResponse
                                .<List<ReevaluationResponse>>builder()
                                .success(true)
                                .message("Reevaluation Requests")
                                .data(response)
                                .build();
        }

        // =========================================================
        // ADMIN - GET REEVALUATION REQUEST BY ID
        // =========================================================

        @Override
        @Transactional
        public ApiResponse<ReevaluationResponse> getReevaluationRequestById(Long id) {

                ReevaluationRequest request = reevaluationRequestRepository
                                .findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Reevaluation request not found."));

                return ApiResponse
                                .<ReevaluationResponse>builder()
                                .success(true)
                                .message("Reevaluation Request")
                                .data(toResponse(request))
                                .build();
        }
}