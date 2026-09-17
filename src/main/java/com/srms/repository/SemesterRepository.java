package com.srms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.srms.entity.Semester;

public interface SemesterRepository extends JpaRepository<Semester, Long> {

    List<Semester> findByCourseId(Long courseId);

    boolean existsBySemesterNumberAndCourseId(Integer semesterNumber, Long courseId);

}