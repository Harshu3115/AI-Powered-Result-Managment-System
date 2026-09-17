package com.srms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.srms.entity.ReevaluationSubject;
import com.srms.entity.Teacher;
import com.srms.enums.ReevaluationStatus;

public interface ReevaluationSubjectRepository
        extends JpaRepository<ReevaluationSubject, Long> {

    List<ReevaluationSubject> findByTeacher(
            Teacher teacher);

    List<ReevaluationSubject> findByTeacherAndStatus(
            Teacher teacher,
            ReevaluationStatus status);

    List<ReevaluationSubject> findByReevaluationRequestId(
            Long reevaluationRequestId);

    long countByStatus(
            ReevaluationStatus status);
}