package com.srms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.srms.entity.ReevaluationRequest;
import com.srms.entity.Student;

public interface ReevaluationRequestRepository
        extends JpaRepository<ReevaluationRequest, Long> {

    // Student's reevaluation applications
    List<ReevaluationRequest> findByStudent(Student student);
}