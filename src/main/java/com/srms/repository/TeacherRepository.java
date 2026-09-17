package com.srms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.srms.entity.Teacher;
import com.srms.entity.User;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {

    boolean existsByTeacherCode(String teacherCode);

    boolean existsByEmail(String email);

    Optional<Teacher> findByTeacherCode(String teacherCode);
    
    Optional<Teacher> findByUser(User user);

}