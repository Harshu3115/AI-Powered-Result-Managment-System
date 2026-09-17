package com.srms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.srms.entity.Teacher;
import com.srms.entity.TeacherSubject;

public interface TeacherSubjectRepository
        extends JpaRepository<TeacherSubject, Long> {

    boolean existsByTeacherIdAndSubjectId(Long teacherId,
            Long subjectId);

    List<TeacherSubject> findByTeacher(Teacher teacher);

    void deleteBySubjectId(Long subjectId);

    Optional<TeacherSubject> findBySubjectId(Long subjectId);
}