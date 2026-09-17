package com.srms.ai.service.impl;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.srms.ai.dto.response.AiStatisticsResponse;
import com.srms.ai.dto.response.AiStatisticsResponse.DepartmentStatistics;
import com.srms.ai.dto.response.AiStatisticsResponse.SemesterStatistics;
import com.srms.ai.dto.response.AiStatisticsResponse.SubjectStatistics;
import com.srms.ai.service.AiStatisticsService;

import com.srms.entity.Department;
import com.srms.entity.Result;
import com.srms.entity.ResultSubject;

import com.srms.enums.ResultStatus;

import com.srms.repository.DepartmentRepository;
import com.srms.repository.ResultRepository;
import com.srms.repository.StudentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AiStatisticsServiceImpl implements AiStatisticsService {

        private final ResultRepository resultRepository;
        private final StudentRepository studentRepository;
        private final DepartmentRepository departmentRepository;

        // ============================================================
        // GENERATE ALL AI STATISTICS
        // ============================================================

        @Override
        public AiStatisticsResponse generateStatistics() {

                List<Result> results = resultRepository.findAll();

                // ========================================================
                // OVERALL STATISTICS
                // ========================================================

                long totalStudents = studentRepository.count();

                long totalResults = results.size();

                long passedResults = results.stream()
                                .filter(result -> result != null
                                                && result.getResultStatus() == ResultStatus.PASS)
                                .count();

                long failedResults = results.stream()
                                .filter(result -> result != null
                                                && result.getResultStatus() == ResultStatus.FAIL)
                                .count();

                double passPercentage = totalResults == 0
                                ? 0.0
                                : (passedResults * 100.0) / totalResults;

                double averageSGPA = results.stream()
                                .filter(Objects::nonNull)
                                .map(Result::getSgpa)
                                .filter(Objects::nonNull)
                                .mapToDouble(Double::doubleValue)
                                .average()
                                .orElse(0.0);

                double averagePercentage = results.stream()
                                .filter(Objects::nonNull)
                                .map(Result::getPercentage)
                                .filter(Objects::nonNull)
                                .mapToDouble(Double::doubleValue)
                                .average()
                                .orElse(0.0);

                // ========================================================
                // SUBJECT STATISTICS
                // ========================================================

                List<SubjectStatistics> subjectStatistics = generateSubjectStatistics(results);

                // ========================================================
                // SEMESTER STATISTICS
                // ========================================================

                List<SemesterStatistics> semesterStatistics = generateSemesterStatistics(results);

                // ========================================================
                // DEPARTMENT STATISTICS
                // ========================================================

                List<DepartmentStatistics> departmentStatistics = generateDepartmentStatistics(results);

                // ========================================================
                // FINAL RESPONSE
                // ========================================================

                return AiStatisticsResponse.builder()

                                .totalStudents(totalStudents)

                                .totalResults(totalResults)

                                .passedResults(passedResults)

                                .failedResults(failedResults)

                                .passPercentage(
                                                round(passPercentage))

                                .averageSGPA(
                                                round(averageSGPA))

                                .averagePercentage(
                                                round(averagePercentage))

                                .subjectStatistics(
                                                subjectStatistics)

                                .semesterStatistics(
                                                semesterStatistics)

                                .departmentStatistics(
                                                departmentStatistics)

                                .build();
        }

        // ============================================================
        // DEPARTMENT STATISTICS
        // ============================================================

        private List<DepartmentStatistics> generateDepartmentStatistics(
                        List<Result> results) {

                List<Department> departments = departmentRepository.findAll();

                List<DepartmentStatistics> statistics = new ArrayList<>();

                for (Department department : departments) {

                        if (department == null ||
                                        department.getId() == null) {
                                continue;
                        }

                        // ====================================================
                        // FIND RESULTS FOR THIS DEPARTMENT
                        // Result
                        // ↓
                        // Semester
                        // ↓
                        // Course
                        // ↓
                        // Department
                        // ====================================================

                        List<Result> departmentResults = results.stream()

                                        .filter(Objects::nonNull)

                                        .filter(result -> result.getSemester() != null)

                                        .filter(result -> result.getSemester().getCourse() != null)

                                        .filter(result -> result.getSemester()
                                                        .getCourse()
                                                        .getDepartment() != null)

                                        .filter(result -> department.getId().equals(
                                                        result.getSemester()
                                                                        .getCourse()
                                                                        .getDepartment()
                                                                        .getId()))

                                        .collect(Collectors.toList());

                        // ====================================================
                        // TOTAL RESULTS
                        // ====================================================

                        int totalResults = departmentResults.size();

                        // ====================================================
                        // TOTAL STUDENTS
                        // ====================================================

                        int totalStudents = (int) departmentResults.stream()

                                        .filter(result -> result.getStudent() != null)

                                        .map(result -> result.getStudent().getId())

                                        .filter(Objects::nonNull)

                                        .distinct()

                                        .count();

                        // ====================================================
                        // PASSED RESULTS
                        // ====================================================

                        int passedResults = (int) departmentResults.stream()

                                        .filter(result -> result.getResultStatus() == ResultStatus.PASS)

                                        .count();

                        // ====================================================
                        // FAILED RESULTS
                        // ====================================================

                        int failedResults = (int) departmentResults.stream()

                                        .filter(result -> result.getResultStatus() == ResultStatus.FAIL)

                                        .count();

                        // ====================================================
                        // PASS PERCENTAGE
                        // ====================================================

                        double passPercentage = totalResults == 0
                                        ? 0.0
                                        : (passedResults * 100.0)
                                                        / totalResults;

                        // ====================================================
                        // AVERAGE SGPA
                        // ====================================================

                        double averageSGPA = departmentResults.stream()

                                        .map(Result::getSgpa)

                                        .filter(Objects::nonNull)

                                        .mapToDouble(Double::doubleValue)

                                        .average()

                                        .orElse(0.0);

                        // ====================================================
                        // AVERAGE PERCENTAGE
                        // ====================================================

                        double averagePercentage = departmentResults.stream()

                                        .map(Result::getPercentage)

                                        .filter(Objects::nonNull)

                                        .mapToDouble(Double::doubleValue)

                                        .average()

                                        .orElse(0.0);

                        // ====================================================
                        // CREATE DEPARTMENT STATISTICS
                        // ====================================================

                        DepartmentStatistics departmentStatistics = DepartmentStatistics.builder()

                                        .departmentId(
                                                        department.getId())

                                        .departmentCode(
                                                        department.getDepartmentCode())

                                        .departmentName(
                                                        department.getDepartmentName())

                                        .totalStudents(
                                                        totalStudents)

                                        .totalResults(
                                                        totalResults)

                                        .passedResults(
                                                        passedResults)

                                        .failedResults(
                                                        failedResults)

                                        .passPercentage(
                                                        round(passPercentage))

                                        .averageSGPA(
                                                        round(averageSGPA))

                                        .averagePercentage(
                                                        round(averagePercentage))

                                        .build();

                        statistics.add(departmentStatistics);
                }

                // ========================================================
                // SORT
                // BEST DEPARTMENT FIRST
                // ========================================================

                statistics.sort(
                                Comparator.comparing(
                                                DepartmentStatistics::getAveragePercentage)
                                                .reversed());

                return statistics;
        }

        // ============================================================
        // SUBJECT STATISTICS
        // ============================================================

        private List<SubjectStatistics> generateSubjectStatistics(
                        List<Result> results) {

                Map<Long, List<ResultSubject>> groupedSubjects = results.stream()

                                .filter(Objects::nonNull)

                                .filter(result -> result.getResultSubjects() != null)

                                .flatMap(result -> result.getResultSubjects().stream())

                                .filter(Objects::nonNull)

                                .filter(resultSubject -> resultSubject.getSubject() != null)

                                .filter(resultSubject -> resultSubject.getSubject().getId() != null)

                                .collect(
                                                Collectors.groupingBy(
                                                                resultSubject -> resultSubject
                                                                                .getSubject()
                                                                                .getId()));

                List<SubjectStatistics> statistics = new ArrayList<>();

                for (List<ResultSubject> subjects : groupedSubjects.values()) {

                        if (subjects == null ||
                                        subjects.isEmpty()) {
                                continue;
                        }

                        ResultSubject first = subjects.get(0);

                        int totalAttempts = subjects.size();

                        int passedAttempts = (int) subjects.stream()
                                        .filter(this::isSubjectPassed)
                                        .count();

                        int failedAttempts = totalAttempts - passedAttempts;

                        double passPercentage = totalAttempts == 0
                                        ? 0.0
                                        : (passedAttempts * 100.0)
                                                        / totalAttempts;

                        double averageMarks = subjects.stream()

                                        .map(ResultSubject::getObtainedMarks)

                                        .filter(Objects::nonNull)

                                        .mapToInt(Integer::intValue)

                                        .average()

                                        .orElse(0.0);

                        double averagePercentage = subjects.stream()

                                        .map(ResultSubject::getPercentage)

                                        .filter(Objects::nonNull)

                                        .mapToDouble(Double::doubleValue)

                                        .average()

                                        .orElse(0.0);

                        statistics.add(
                                        SubjectStatistics.builder()

                                                        .subjectCode(
                                                                        first.getSubject()
                                                                                        .getSubjectCode())

                                                        .subjectName(
                                                                        first.getSubject()
                                                                                        .getSubjectName())

                                                        .totalAttempts(
                                                                        totalAttempts)

                                                        .passedAttempts(
                                                                        passedAttempts)

                                                        .failedAttempts(
                                                                        failedAttempts)

                                                        .passPercentage(
                                                                        round(passPercentage))

                                                        .averageMarks(
                                                                        round(averageMarks))

                                                        .averagePercentage(
                                                                        round(averagePercentage))

                                                        .build());
                }

                // Best subjects first

                statistics.sort(
                                Comparator.comparing(
                                                SubjectStatistics::getAveragePercentage)
                                                .reversed());

                return statistics;
        }

        // ============================================================
        // SUBJECT PASS CHECK
        // ============================================================

        private boolean isSubjectPassed(
                        ResultSubject resultSubject) {

                if (resultSubject == null) {
                        return false;
                }

                if (resultSubject.getObtainedMarks() == null) {
                        return false;
                }

                if (resultSubject.getSubject() == null) {
                        return false;
                }

                Integer passingMarks = resultSubject.getSubject()
                                .getPassingMarks();

                if (passingMarks == null) {
                        return false;
                }

                return resultSubject.getObtainedMarks() >= passingMarks;
        }

        // ============================================================
        // SEMESTER STATISTICS
        // ============================================================

        private List<SemesterStatistics> generateSemesterStatistics(
                        List<Result> results) {

                Map<Long, List<Result>> grouped = results.stream()

                                .filter(Objects::nonNull)

                                .filter(result -> result.getSemester() != null)

                                .filter(result -> result.getSemester().getId() != null)

                                .collect(
                                                Collectors.groupingBy(
                                                                result -> result.getSemester()
                                                                                .getId()));

                List<SemesterStatistics> statistics = new ArrayList<>();

                for (List<Result> semesterResults : grouped.values()) {

                        if (semesterResults == null ||
                                        semesterResults.isEmpty()) {
                                continue;
                        }

                        Result first = semesterResults.get(0);

                        double averageSGPA = semesterResults.stream()

                                        .map(Result::getSgpa)

                                        .filter(Objects::nonNull)

                                        .mapToDouble(Double::doubleValue)

                                        .average()

                                        .orElse(0.0);

                        double averagePercentage = semesterResults.stream()

                                        .map(Result::getPercentage)

                                        .filter(Objects::nonNull)

                                        .mapToDouble(Double::doubleValue)

                                        .average()

                                        .orElse(0.0);

                        String semesterName = first.getSemester()
                                        .getSemesterName();

                        if (semesterName == null ||
                                        semesterName.trim().isEmpty()) {

                                Integer semesterNumber = first.getSemester()
                                                .getSemesterNumber();

                                if (semesterNumber != null) {

                                        semesterName = "Semester " + semesterNumber;

                                } else {

                                        semesterName = "Unknown Semester";
                                }
                        }

                        statistics.add(
                                        SemesterStatistics.builder()

                                                        .semesterName(
                                                                        semesterName)

                                                        .totalResults(
                                                                        semesterResults.size())

                                                        .averageSGPA(
                                                                        round(averageSGPA))

                                                        .averagePercentage(
                                                                        round(averagePercentage))

                                                        .build());
                }

                return statistics;
        }

        // ============================================================
        // ROUND DECIMAL
        // ============================================================

        private double round(double value) {

                return Math.round(value * 100.0)
                                / 100.0;
        }
}