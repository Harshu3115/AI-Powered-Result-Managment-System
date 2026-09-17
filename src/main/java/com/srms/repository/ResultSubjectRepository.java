package com.srms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.srms.entity.ResultSubject;

public interface ResultSubjectRepository
        extends JpaRepository<ResultSubject, Long> {

    List<ResultSubject> findByResultId(Long resultId);

    List<ResultSubject> findBySubjectId(Long subjectId);

    List<ResultSubject> findByResultStudentId(Long studentId);
}