package com.srms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.srms.entity.RecheckingRequest;
import com.srms.entity.Student;

public interface RecheckingRequestRepository
        extends JpaRepository<RecheckingRequest, Long> {

    // Student's rechecking applications
    List<RecheckingRequest> findByStudent(Student student);
}