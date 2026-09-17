package com.srms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.srms.entity.Course;

public interface CourseRepository extends JpaRepository<Course, Long> {

    boolean existsByCourseCode(String courseCode);

    Optional<Course> findByCourseCode(String courseCode);

    List<Course> findByDepartmentId(Long departmentId);

}