package com.srms.service.impl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.srms.dto.request.LoginRequest;
import com.srms.dto.request.RegisterRequest;
import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.LoginResponse;
import com.srms.entity.User;
import com.srms.enums.Role;
import com.srms.exception.BadRequestException;
import com.srms.exception.ResourceNotFoundException;
import com.srms.repository.UserRepository;
import com.srms.security.CustomUserDetailsService;
import com.srms.security.jwt.JwtService;
import com.srms.service.AuthService;
import com.srms.entity.Student;
import com.srms.repository.StudentRepository;
import com.srms.entity.Student;
import com.srms.entity.User;
import com.srms.repository.StudentRepository;
import com.srms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import com.srms.entity.Teacher;
import com.srms.entity.Department;
import com.srms.repository.TeacherRepository;
import com.srms.repository.DepartmentRepository;
import com.srms.enums.Role;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

        private final UserRepository userRepository;
        private final StudentRepository studentRepository;
        private final PasswordEncoder passwordEncoder;
        private final AuthenticationManager authenticationManager;
        private final JwtService jwtService;
        private final CustomUserDetailsService userDetailsService;
        private final TeacherRepository teacherRepository;
        private final DepartmentRepository departmentRepository;

        @Transactional
        @Override
        public ApiResponse<String> register(RegisterRequest request) {

                // ==========================================
                // CHECK USERNAME
                // ==========================================

                if (userRepository.existsByUsername(request.getUsername())) {
                        throw new BadRequestException(
                                        "Username already exists.");
                }

                // ==========================================
                // CHECK USER EMAIL
                // ==========================================

                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new BadRequestException(
                                        "Email already exists.");
                }

                // ==========================================
                // STUDENT REGISTRATION
                // ==========================================

                if (request.getRole() == Role.STUDENT) {

                        // Student validation

                        if (request.getRollNo() == null ||
                                        request.getRollNo().isBlank()) {

                                throw new BadRequestException(
                                                "Roll number is required.");
                        }

                        if (request.getEnrollmentNo() == null ||
                                        request.getEnrollmentNo().isBlank()) {

                                throw new BadRequestException(
                                                "Enrollment number is required.");
                        }

                        if (request.getPrnNo() == null) {

                                throw new BadRequestException(
                                                "PRN number is required.");
                        }

                        if (request.getFirstName() == null ||
                                        request.getFirstName().isBlank()) {

                                throw new BadRequestException(
                                                "First name is required.");
                        }

                        if (request.getLastName() == null ||
                                        request.getLastName().isBlank()) {

                                throw new BadRequestException(
                                                "Last name is required.");
                        }

                        // Duplicate checks

                        if (studentRepository.existsByRollNo(
                                        request.getRollNo())) {

                                throw new BadRequestException(
                                                "Roll number already exists.");
                        }

                        if (studentRepository.existsByEnrollmentNo(
                                        request.getEnrollmentNo())) {

                                throw new BadRequestException(
                                                "Enrollment number already exists.");
                        }

                        if (studentRepository.existsByPrnNo(
                                        request.getPrnNo())) {

                                throw new BadRequestException(
                                                "PRN number already exists.");
                        }
                }

                // ==========================================
                // TEACHER REGISTRATION
                // ==========================================

                if (request.getRole() == Role.TEACHER) {

                        // Teacher Code

                        if (request.getTeacherCode() == null ||
                                        request.getTeacherCode().isBlank()) {

                                throw new BadRequestException(
                                                "Teacher code is required.");
                        }

                        // First Name

                        if (request.getFirstName() == null ||
                                        request.getFirstName().isBlank()) {

                                throw new BadRequestException(
                                                "First name is required.");
                        }

                        // Last Name

                        if (request.getLastName() == null ||
                                        request.getLastName().isBlank()) {

                                throw new BadRequestException(
                                                "Last name is required.");
                        }

                        // Mobile

                        if (request.getMobile() == null ||
                                        !request.getMobile().matches("\\d{10}")) {

                                throw new BadRequestException(
                                                "Valid 10 digit mobile number is required.");
                        }

                        // Gender

                        if (request.getGender() == null) {

                                throw new BadRequestException(
                                                "Gender is required.");
                        }

                        // Department

                        if (request.getDepartmentId() == null) {

                                throw new BadRequestException(
                                                "Department is required.");
                        }

                        // Duplicate Teacher Code

                        if (teacherRepository.existsByTeacherCode(
                                        request.getTeacherCode())) {

                                throw new BadRequestException(
                                                "Teacher code already exists.");
                        }
                }

                // ==========================================
                // CREATE USER
                // ==========================================

                User user = User.builder()
                                .username(request.getUsername())
                                .email(request.getEmail())
                                .password(
                                                passwordEncoder.encode(
                                                                request.getPassword()))
                                .role(request.getRole())
                                .enabled(true)
                                .build();

                userRepository.save(user);

                // ==========================================
                // CREATE STUDENT
                // ==========================================

                if (request.getRole() == Role.STUDENT) {

                        Student student = Student.builder()

                                        .rollNo(request.getRollNo())

                                        .enrollmentNo(
                                                        request.getEnrollmentNo())

                                        .prnNo(
                                                        request.getPrnNo())

                                        .firstName(
                                                        request.getFirstName())

                                        .lastName(
                                                        request.getLastName())

                                        .email(
                                                        request.getEmail())

                                        .mobile(
                                                        request.getMobile())

                                        .gender(
                                                        request.getGender())

                                        .dateOfBirth(
                                                        request.getDateOfBirth())

                                        .admissionYear(
                                                        request.getAdmissionYear())

                                        .user(user)

                                        .build();

                        studentRepository.save(student);
                }

                // ==========================================
                // CREATE TEACHER
                // ==========================================

                if (request.getRole() == Role.TEACHER) {

                        Department department = departmentRepository.findById(
                                        request.getDepartmentId())
                                        .orElseThrow(() -> new ResourceNotFoundException(
                                                        "Department not found."));

                        Teacher teacher = Teacher.builder()

                                        .teacherCode(
                                                        request.getTeacherCode())

                                        .firstName(
                                                        request.getFirstName())

                                        .lastName(
                                                        request.getLastName())

                                        .email(
                                                        request.getEmail())

                                        .mobile(
                                                        request.getMobile())

                                        .gender(
                                                        request.getGender())

                                        .qualification(
                                                        request.getQualification())

                                        .designation(
                                                        request.getDesignation())

                                        .experience(
                                                        request.getExperience())

                                        .department(
                                                        department)

                                        .user(user)

                                        .build();

                        teacherRepository.save(teacher);
                }

                // ==========================================
                // RESPONSE
                // ==========================================

                String message;

                if (request.getRole() == Role.STUDENT) {

                        message = "Student registered successfully.";

                } else if (request.getRole() == Role.TEACHER) {

                        message = "Teacher registered successfully.";

                } else {

                        message = "User registered successfully.";
                }

                return ApiResponse.<String>builder()
                                .success(true)
                                .message(message)
                                .data(null)
                                .build();
        }

        @Override
        public ApiResponse<LoginResponse> login(LoginRequest request) {

                // ==========================================
                // FIND USER
                // ==========================================

                User user = userRepository
                                .findByUsername(request.getUsername())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found"));

                // ==========================================
                // LOGIN DEBUG
                // ==========================================

                System.out.println(
                                "========== LOGIN DEBUG ==========");

                System.out.println(
                                "Username: " +
                                                user.getUsername());

                System.out.println(
                                "Role: " +
                                                user.getRole());

                System.out.println(
                                "Enabled: " +
                                                user.getEnabled());

                System.out.println(
                                "Password hash: " +
                                                user.getPassword());

                System.out.println(
                                "Password matches: " +
                                                passwordEncoder.matches(
                                                                request.getPassword(),
                                                                user.getPassword()));

                System.out.println(
                                "=================================");

                // ==========================================
                // AUTHENTICATE USER
                // ==========================================

                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getUsername(),
                                                request.getPassword()));

                // ==========================================
                // LOAD USER DETAILS
                // ==========================================

                UserDetails userDetails = userDetailsService.loadUserByUsername(
                                request.getUsername());

                // ==========================================
                // GENERATE JWT
                // ==========================================

                String token = jwtService.generateToken(userDetails);

                // ==========================================
                // LOGIN RESPONSE
                // ==========================================

                LoginResponse response = LoginResponse.builder()
                                .token(token)
                                .username(user.getUsername())
                                .role(user.getRole())
                                .build();

                return ApiResponse.<LoginResponse>builder()
                                .success(true)
                                .message("Login Successful")
                                .data(response)
                                .build();
        }
}