package com.srms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.srms.entity.RecheckingSubject;
import com.srms.entity.Teacher;
import com.srms.enums.RecheckingStatus;

public interface RecheckingSubjectRepository
                extends JpaRepository<RecheckingSubject, Long> {

        // All rechecking subjects assigned to teacher
        List<RecheckingSubject> findByTeacher(Teacher teacher);

        // Teacher's pending requests
        List<RecheckingSubject> findByTeacherAndStatus(
                        Teacher teacher,
                        RecheckingStatus status);

        // Subjects belonging to one application
        List<RecheckingSubject> findByRecheckingRequestId(
                        Long recheckingRequestId);

        long countByStatus(RecheckingStatus status);
}