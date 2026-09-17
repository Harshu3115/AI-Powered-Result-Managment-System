package com.srms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.srms.entity.Student;
import com.srms.entity.User;

public interface StudentRepository
        extends JpaRepository<Student, Long> {

    boolean existsByRollNo(String rollNo);

    boolean existsByEnrollmentNo(String enrollmentNo);

    boolean existsByPrnNo(Long prnNo);

    boolean existsByEmail(String email);

    Optional<Student> findByRollNo(String rollNo);

    Optional<Student> findByUser(User user);
}