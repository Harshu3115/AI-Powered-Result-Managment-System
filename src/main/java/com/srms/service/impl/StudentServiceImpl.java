package com.srms.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.srms.dto.request.StudentProfileRequest;
import com.srms.dto.request.StudentRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.StudentProfileResponse;
import com.srms.dto.response.StudentResponse;
import com.srms.entity.Semester;
import com.srms.entity.Student;
import com.srms.entity.User;
import com.srms.enums.Role;
import com.srms.exception.BadRequestException;
import com.srms.exception.ResourceNotFoundException;
import com.srms.mapper.StudentMapper;
import com.srms.repository.SemesterRepository;
import com.srms.repository.StudentRepository;
import com.srms.repository.UserRepository;
import com.srms.service.StudentService;

import com.srms.dto.response.StudentProfileResponse;
import com.srms.entity.Student;
import com.srms.entity.User;
import com.srms.dto.request.StudentProfileRequest;
import com.srms.dto.request.ChangePasswordRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

        private final StudentRepository studentRepository;
        private final SemesterRepository semesterRepository;
        private final UserRepository userRepository;
        private final StudentMapper studentMapper;
        private final PasswordEncoder passwordEncoder;

        @Override
        public ApiResponse<StudentResponse> addStudent(StudentRequest request) {

                if (studentRepository.existsByRollNo(request.getRollNo())) {
                        throw new BadRequestException("Roll Number already exists.");
                }

                if (studentRepository.existsByEnrollmentNo(request.getEnrollmentNo())) {
                        throw new BadRequestException("Enrollment Number already exists.");
                }

                if (userRepository.existsByUsername(request.getUsername())) {
                        throw new BadRequestException("Username already exists.");
                }

                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new BadRequestException("Email already exists.");
                }

                Semester semester = semesterRepository
                                .findById(request.getSemesterId())
                                .orElseThrow(() -> new ResourceNotFoundException("Semester not found."));

                User user = User.builder()
                                .username(request.getUsername())
                                .email(request.getEmail())
                                .password(
                                                passwordEncoder.encode(
                                                                request.getPassword()))
                                .role(Role.STUDENT)
                                .enabled(true)
                                .build();

                user = userRepository.save(user);

                Student student = Student.builder()
                                .rollNo(request.getRollNo())
                                .enrollmentNo(request.getEnrollmentNo())

                                // ⭐ FIX
                                .prnNo(request.getPrnNo())

                                .firstName(request.getFirstName())
                                .lastName(request.getLastName())
                                .email(request.getEmail())
                                .mobile(request.getMobile())
                                .gender(request.getGender())
                                .dateOfBirth(request.getDateOfBirth())
                                .admissionYear(request.getAdmissionYear())
                                .semester(semester)
                                .user(user)
                                .build();

                student = studentRepository.save(student);

                return ApiResponse.<StudentResponse>builder()
                                .success(true)
                                .message("Student Added Successfully")
                                .data(studentMapper.toResponse(student))
                                .build();
        }

        @Override
        public ApiResponse<List<StudentResponse>> getAllStudents() {

                List<StudentResponse> response = studentRepository.findAll()
                                .stream()
                                .map(studentMapper::toResponse)
                                .collect(Collectors.toList());

                return ApiResponse.<List<StudentResponse>>builder()
                                .success(true)
                                .message("Student List")
                                .data(response)
                                .build();
        }

        @Override
        public ApiResponse<StudentResponse> getStudentById(Long id) {

                Student student = studentRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Student not found."));

                return ApiResponse.<StudentResponse>builder()
                                .success(true)
                                .message("Student Found")
                                .data(studentMapper.toResponse(student))
                                .build();
        }

        @Override
        public ApiResponse<StudentResponse> updateStudent(Long id,
                        StudentRequest request) {

                Student student = studentRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Student not found."));

                Semester semester = semesterRepository.findById(request.getSemesterId())
                                .orElseThrow(() -> new ResourceNotFoundException("Semester not found."));

                User user = student.getUser();

                if (!user.getUsername().equals(request.getUsername())
                                && userRepository.existsByUsername(request.getUsername())) {
                        throw new BadRequestException("Username already exists.");
                }

                if (!user.getEmail().equals(request.getEmail())
                                && userRepository.existsByEmail(request.getEmail())) {
                        throw new BadRequestException("Email already exists.");
                }

                user.setUsername(request.getUsername());
                user.setEmail(request.getEmail());

                if (request.getPassword() != null
                                && !request.getPassword().isBlank()) {
                        user.setPassword(passwordEncoder.encode(request.getPassword()));
                }

                userRepository.save(user);

                student.setRollNo(request.getRollNo());
                student.setEnrollmentNo(request.getEnrollmentNo());
                student.setPrnNo(request.getPrnNo());
                student.setFirstName(request.getFirstName());
                student.setLastName(request.getLastName());
                student.setEmail(request.getEmail());
                student.setMobile(request.getMobile());
                student.setGender(request.getGender());
                student.setDateOfBirth(request.getDateOfBirth());
                student.setAdmissionYear(request.getAdmissionYear());
                student.setSemester(semester);

                student = studentRepository.save(student);

                return ApiResponse.<StudentResponse>builder()
                                .success(true)
                                .message("Student Updated Successfully")
                                .data(studentMapper.toResponse(student))
                                .build();
        }

        @Override
        public ApiResponse<String> deleteStudent(Long id) {

                Student student = studentRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Student not found."));

                studentRepository.delete(student);

                return ApiResponse.<String>builder()
                                .success(true)
                                .message("Student Deleted Successfully")
                                .data(null)
                                .build();
        }

        @Override
        public ApiResponse<StudentProfileResponse> getMyProfile(
                        String username) {

                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found."));

                Student student = studentRepository.findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Student not found."));

                StudentProfileResponse response = StudentProfileResponse.builder()
                                .studentId(student.getId())
                                .prnNo(student.getPrnNo())
                                .rollNo(student.getRollNo())
                                .firstName(student.getFirstName())
                                .lastName(student.getLastName())
                                .email(student.getEmail())
                                .mobile(student.getMobile())
                                .gender(
                                                student.getGender() != null
                                                                ? student.getGender().name()
                                                                : null)
                                .courseName(
                                                student.getSemester()
                                                                .getCourse()
                                                                .getCourseName())
                                .departmentName(
                                                student.getSemester()
                                                                .getCourse()
                                                                .getDepartment()
                                                                .getDepartmentName())
                                .semesterName(
                                                student.getSemester()
                                                                .getSemesterName())
                                .build();

                return ApiResponse.<StudentProfileResponse>builder()
                                .success(true)
                                .message("Student Profile")
                                .data(response)
                                .build();
        }

        @Override
        public ApiResponse<StudentProfileResponse> updateMyProfile(
                        String username,
                        StudentProfileRequest request) {

                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

                Student student = studentRepository.findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException("Student not found."));

                // =====================================================
                // CHECK EMAIL UNIQUENESS
                // =====================================================

                if (!user.getEmail().equalsIgnoreCase(request.getEmail())
                                && userRepository.existsByEmail(request.getEmail())) {

                        throw new BadRequestException(
                                        "Email already exists.");
                }

                // =====================================================
                // UPDATE USER
                // =====================================================

                user.setEmail(request.getEmail());

                userRepository.save(user);

                // =====================================================
                // UPDATE STUDENT
                // =====================================================

                student.setFirstName(
                                request.getFirstName());

                student.setLastName(
                                request.getLastName());

                student.setEmail(
                                request.getEmail());

                student.setMobile(
                                request.getMobile());

                student.setGender(
                                request.getGender());

                student.setDateOfBirth(
                                request.getDateOfBirth());

                student = studentRepository.save(student);

                // =====================================================
                // RESPONSE
                // =====================================================

                StudentProfileResponse response = StudentProfileResponse.builder()

                                .studentId(
                                                student.getId())

                                .prnNo(
                                                student.getPrnNo())

                                .rollNo(
                                                student.getRollNo())

                                .firstName(
                                                student.getFirstName())

                                .lastName(
                                                student.getLastName())

                                .email(
                                                student.getEmail())

                                .mobile(
                                                student.getMobile())

                                .gender(
                                                student.getGender() != null
                                                                ? student.getGender().name()
                                                                : null)

                                .dateOfBirth(
                                                student.getDateOfBirth())

                                .courseName(
                                                student.getSemester()
                                                                .getCourse()
                                                                .getCourseName())

                                .departmentName(
                                                student.getSemester()
                                                                .getCourse()
                                                                .getDepartment()
                                                                .getDepartmentName())

                                .semesterName(
                                                student.getSemester()
                                                                .getSemesterName())

                                .build();

                return ApiResponse
                                .<StudentProfileResponse>builder()
                                .success(true)
                                .message("Profile Updated Successfully")
                                .data(response)
                                .build();
        }

        @Override
        public ApiResponse<String> changePassword(
                        String username,
                        ChangePasswordRequest request) {

                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found."));

                if (!passwordEncoder.matches(
                                request.getCurrentPassword(),
                                user.getPassword())) {

                        throw new BadRequestException(
                                        "Current password is incorrect.");
                }

                if (!request.getNewPassword().equals(
                                request.getConfirmPassword())) {

                        throw new BadRequestException(
                                        "New password and confirm password do not match.");
                }

                if (request.getCurrentPassword().equals(
                                request.getNewPassword())) {

                        throw new BadRequestException(
                                        "New password must be different from current password.");
                }

                user.setPassword(
                                passwordEncoder.encode(
                                                request.getNewPassword()));

                userRepository.save(user);

                return ApiResponse.<String>builder()
                                .success(true)
                                .message("Password changed successfully.")
                                .data(null)
                                .build();
        }

}