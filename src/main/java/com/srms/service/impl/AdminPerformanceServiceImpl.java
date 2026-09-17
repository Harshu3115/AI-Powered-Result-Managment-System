package com.srms.service.impl;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.srms.dto.response.ApiResponse;
import com.srms.entity.Department;
import com.srms.entity.Result;
import com.srms.entity.ResultSubject;
import com.srms.entity.Student;
import com.srms.repository.DepartmentRepository;
import com.srms.repository.ResultRepository;
import com.srms.repository.StudentRepository;
import com.srms.service.AdminPerformanceService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminPerformanceServiceImpl
        implements AdminPerformanceService {

    private final ResultRepository resultRepository;
    private final StudentRepository studentRepository;
    private final DepartmentRepository departmentRepository;

    // =========================================================
    // MAIN PERFORMANCE API
    // =========================================================

    @Override
    public ApiResponse<Map<String, Object>> getPerformance() {

        // =====================================================
        // GET DATA
        // =====================================================

        List<Result> results = resultRepository.findAll();
        List<Student> students = studentRepository.findAll();
        List<Department> departments = departmentRepository.findAll();

        // =====================================================
        // BASIC STATISTICS
        // =====================================================

        int totalStudents = students.size();

        int totalResults = results.size();

        long passCount = results.stream()
                .filter(result -> result.getResultStatus() != null
                        && result.getResultStatus()
                                .name()
                                .equalsIgnoreCase("PASS"))
                .count();

        long failCount = results.stream()
                .filter(result -> result.getResultStatus() != null
                        && result.getResultStatus()
                                .name()
                                .equalsIgnoreCase("FAIL"))
                .count();

        double averagePercentage = results.stream()
                .filter(result -> result.getPercentage() != null)
                .mapToDouble(Result::getPercentage)
                .average()
                .orElse(0.0);

        double averageSGPA = results.stream()
                .filter(result -> result.getSgpa() != null)
                .mapToDouble(Result::getSgpa)
                .average()
                .orElse(0.0);

        double passPercentage = totalResults > 0
                ? (passCount * 100.0) / totalResults
                : 0.0;

        double failPercentage = totalResults > 0
                ? (failCount * 100.0) / totalResults
                : 0.0;

        // =====================================================
        // SEMESTER PERFORMANCE
        // =====================================================

        List<Map<String, Object>> semesterPerformance = results.stream()
                .filter(result -> result.getSemester() != null)
                .collect(Collectors.groupingBy(
                        result -> result.getSemester().getId(),
                        LinkedHashMap::new,
                        Collectors.toList()))
                .values()
                .stream()
                .map(this::createSemesterPerformance)
                .sorted(
                        Comparator.comparing(
                                data -> (Integer) data.get("semesterNumber")))
                .collect(Collectors.toList());

        // =====================================================
        // SUBJECT PERFORMANCE
        // =====================================================

        List<ResultSubject> resultSubjects = results.stream()
                .filter(result -> result.getResultSubjects() != null)
                .flatMap(result -> result.getResultSubjects().stream())
                .collect(Collectors.toList());

        List<Map<String, Object>> subjectPerformance = resultSubjects.stream()
                .filter(resultSubject -> resultSubject.getSubject() != null)
                .collect(Collectors.groupingBy(
                        resultSubject -> resultSubject
                                .getSubject()
                                .getId(),
                        LinkedHashMap::new,
                        Collectors.toList()))
                .values()
                .stream()
                .map(this::createSubjectPerformance)
                .sorted(
                        Comparator.comparing(
                                data -> String.valueOf(
                                        data.get("subjectName"))))
                .collect(Collectors.toList());

        // =====================================================
        // DEPARTMENT PERFORMANCE
        // IMPORTANT:
        // Get departments directly from DepartmentRepository.
        // This ensures departments with no results are also shown.
        // =====================================================

        List<Map<String, Object>> departmentPerformance = departments.stream()
                .map(department -> {

                    // Find results belonging to this department
                    List<Result> departmentResults = results.stream()
                            .filter(result -> result.getSemester() != null
                                    && result
                                            .getSemester()
                                            .getCourse() != null
                                    && result
                                            .getSemester()
                                            .getCourse()
                                            .getDepartment() != null
                                    && department
                                            .getId()
                                            .equals(
                                                    result
                                                            .getSemester()
                                                            .getCourse()
                                                            .getDepartment()
                                                            .getId()))
                            .collect(Collectors.toList());

                    Map<String, Object> data = new LinkedHashMap<>();

                    // -----------------------------------------
                    // DEPARTMENT INFORMATION
                    // -----------------------------------------

                    data.put(
                            "departmentId",
                            department.getId());

                    data.put(
                            "departmentCode",
                            department.getDepartmentCode());

                    data.put(
                            "departmentName",
                            department.getDepartmentName());

                    // -----------------------------------------
                    // NO RESULTS
                    // -----------------------------------------

                    if (departmentResults.isEmpty()) {

                        data.put(
                                "averagePercentage",
                                0.0);

                        data.put(
                                "averageSGPA",
                                0.0);

                        data.put(
                                "passCount",
                                0);

                        data.put(
                                "failCount",
                                0);

                        data.put(
                                "totalStudents",
                                0);

                    } else {

                        // -------------------------------------
                        // AVERAGE PERCENTAGE
                        // -------------------------------------

                        double deptAveragePercentage = departmentResults.stream()
                                .filter(result -> result.getPercentage() != null)
                                .mapToDouble(
                                        Result::getPercentage)
                                .average()
                                .orElse(0.0);

                        // -------------------------------------
                        // AVERAGE SGPA
                        // -------------------------------------

                        double deptAverageSGPA = departmentResults.stream()
                                .filter(result -> result.getSgpa() != null)
                                .mapToDouble(
                                        Result::getSgpa)
                                .average()
                                .orElse(0.0);

                        // -------------------------------------
                        // PASS COUNT
                        // -------------------------------------

                        long deptPassCount = departmentResults.stream()
                                .filter(result -> result
                                        .getResultStatus() != null
                                        && result
                                                .getResultStatus()
                                                .name()
                                                .equalsIgnoreCase(
                                                        "PASS"))
                                .count();

                        // -------------------------------------
                        // FAIL COUNT
                        // -------------------------------------

                        long deptFailCount = departmentResults.stream()
                                .filter(result -> result
                                        .getResultStatus() != null
                                        && result
                                                .getResultStatus()
                                                .name()
                                                .equalsIgnoreCase(
                                                        "FAIL"))
                                .count();

                        // -------------------------------------
                        // UNIQUE STUDENTS
                        // -------------------------------------

                        long deptTotalStudents = departmentResults.stream()
                                .filter(result -> result.getStudent() != null)
                                .map(result -> result
                                        .getStudent()
                                        .getId())
                                .distinct()
                                .count();

                        // -------------------------------------
                        // PUT DATA
                        // -------------------------------------

                        data.put(
                                "averagePercentage",
                                round(
                                        deptAveragePercentage));

                        data.put(
                                "averageSGPA",
                                round(
                                        deptAverageSGPA));

                        data.put(
                                "passCount",
                                deptPassCount);

                        data.put(
                                "failCount",
                                deptFailCount);

                        data.put(
                                "totalStudents",
                                deptTotalStudents);
                    }

                    return data;
                })
                .sorted(
                        Comparator.comparing(
                                data -> String.valueOf(
                                        data.get(
                                                "departmentName"))))
                .collect(Collectors.toList());

        // =====================================================
        // FINAL RESPONSE
        // =====================================================

        Map<String, Object> data = new LinkedHashMap<>();

        data.put(
                "totalStudents",
                totalStudents);

        data.put(
                "totalResults",
                totalResults);

        data.put(
                "averagePercentage",
                round(averagePercentage));

        data.put(
                "averageSGPA",
                round(averageSGPA));

        data.put(
                "passCount",
                passCount);

        data.put(
                "failCount",
                failCount);

        data.put(
                "passPercentage",
                round(passPercentage));

        data.put(
                "failPercentage",
                round(failPercentage));

        data.put(
                "semesterPerformance",
                semesterPerformance);

        data.put(
                "subjectPerformance",
                subjectPerformance);

        data.put(
                "departmentPerformance",
                departmentPerformance);

        return ApiResponse
                .<Map<String, Object>>builder()
                .success(true)
                .message("Admin Performance Data")
                .data(data)
                .build();
    }

    // =========================================================
    // SEMESTER PERFORMANCE
    // =========================================================

    private Map<String, Object> createSemesterPerformance(
            List<Result> results) {

        Result firstResult = results.get(0);

        Map<String, Object> data = new LinkedHashMap<>();

        int semesterNumber = firstResult
                .getSemester()
                .getSemesterNumber();

        String semesterName = firstResult
                .getSemester()
                .getSemesterName();

        double averagePercentage = results.stream()
                .filter(result -> result.getPercentage() != null)
                .mapToDouble(Result::getPercentage)
                .average()
                .orElse(0.0);

        double averageSGPA = results.stream()
                .filter(result -> result.getSgpa() != null)
                .mapToDouble(Result::getSgpa)
                .average()
                .orElse(0.0);

        long passCount = results.stream()
                .filter(result -> result.getResultStatus() != null
                        && result
                                .getResultStatus()
                                .name()
                                .equalsIgnoreCase(
                                        "PASS"))
                .count();

        long failCount = results.stream()
                .filter(result -> result.getResultStatus() != null
                        && result
                                .getResultStatus()
                                .name()
                                .equalsIgnoreCase(
                                        "FAIL"))
                .count();

        data.put(
                "semesterNumber",
                semesterNumber);

        data.put(
                "semesterName",
                semesterName);

        data.put(
                "averagePercentage",
                round(averagePercentage));

        data.put(
                "averageSGPA",
                round(averageSGPA));

        data.put(
                "passCount",
                passCount);

        data.put(
                "failCount",
                failCount);

        return data;
    }

    // =========================================================
    // SUBJECT PERFORMANCE
    // =========================================================

    private Map<String, Object> createSubjectPerformance(
            List<ResultSubject> subjects) {

        ResultSubject first = subjects.get(0);

        Map<String, Object> data = new LinkedHashMap<>();

        String subjectCode = first
                .getSubject()
                .getSubjectCode();

        String subjectName = first
                .getSubject()
                .getSubjectName();

        double averageMarks = subjects.stream()
                .filter(resultSubject -> resultSubject
                        .getObtainedMarks() != null)
                .mapToInt(
                        ResultSubject::getObtainedMarks)
                .average()
                .orElse(0.0);

        double averagePercentage = subjects.stream()
                .filter(resultSubject -> resultSubject
                        .getPercentage() != null)
                .mapToDouble(
                        ResultSubject::getPercentage)
                .average()
                .orElse(0.0);

        long passCount = subjects.stream()
                .filter(resultSubject -> resultSubject
                        .getPercentage() != null
                        && resultSubject
                                .getPercentage() >= 40)
                .count();

        long failCount = subjects.size() - passCount;

        data.put(
                "subjectCode",
                subjectCode);

        data.put(
                "subjectName",
                subjectName);

        data.put(
                "averageMarks",
                round(averageMarks));

        data.put(
                "averagePercentage",
                round(averagePercentage));

        data.put(
                "passCount",
                passCount);

        data.put(
                "failCount",
                failCount);

        return data;
    }

    // =========================================================
    // ROUND
    // =========================================================

    private double round(double value) {

        return Math.round(value * 100.0) / 100.0;
    }
}