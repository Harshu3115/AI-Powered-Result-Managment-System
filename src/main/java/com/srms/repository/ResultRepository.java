package com.srms.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.srms.entity.Result;
import com.srms.enums.ResultStatus;

public interface ResultRepository extends JpaRepository<Result, Long> {

        Optional<Result> findByStudentIdAndSemesterId(
                        Long studentId,
                        Long semesterId);

        List<Result> findByStudentId(Long studentId);

        List<Result> findBySemesterId(Long semesterId);

        long countByResultStatus(ResultStatus resultStatus);

        List<Result> findByStudentIdOrderBySemesterSemesterNumberAsc(
                        Long studentId);

        List<Result> findByStudentIdIn(List<Long> studentIds);
}