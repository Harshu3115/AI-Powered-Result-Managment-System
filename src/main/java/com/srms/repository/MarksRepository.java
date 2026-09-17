package com.srms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.srms.entity.Marks;

public interface MarksRepository
		extends JpaRepository<Marks, Long> {

	List<Marks> findByStudentId(Long studentId);

	List<Marks> findByTeacherId(Long teacherId);

	List<Marks> findBySubjectId(Long subjectId);

	Optional<Marks> findByStudentIdAndSubjectId(
			Long studentId,
			Long subjectId);

	List<Marks> findByStudentIdAndSubjectSemesterId(
			Long studentId,
			Long semesterId);

}