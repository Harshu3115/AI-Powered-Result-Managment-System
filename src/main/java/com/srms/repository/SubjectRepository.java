package com.srms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.srms.entity.Subject;

public interface SubjectRepository extends JpaRepository<Subject, Long> {

    boolean existsBySubjectCode(String subjectCode);

    Optional<Subject> findBySubjectCode(String subjectCode);

    List<Subject> findBySemesterId(Long semesterId);

}