package com.srms.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.srms.dto.response.AdminDashboardResponse;
import com.srms.entity.Result;
import com.srms.enums.RecheckingStatus;
import com.srms.enums.ResultStatus;
import com.srms.repository.CourseRepository;
import com.srms.repository.RecheckingSubjectRepository;
import com.srms.repository.ResultRepository;
import com.srms.repository.StudentRepository;
import com.srms.repository.SubjectRepository;
import com.srms.repository.TeacherRepository;
import com.srms.service.AdminDashboardService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminDashboardServiceImpl
        implements AdminDashboardService {

    private final StudentRepository studentRepository;

    private final TeacherRepository teacherRepository;

    private final CourseRepository courseRepository;

    private final SubjectRepository subjectRepository;

    private final ResultRepository resultRepository;

    private final RecheckingSubjectRepository recheckingSubjectRepository;

    @Override
    public AdminDashboardResponse getDashboard() {

        long totalStudents = studentRepository.count();

        long totalTeachers = teacherRepository.count();

        long totalCourses = courseRepository.count();

        long totalSubjects = subjectRepository.count();

        long totalResults = resultRepository.count();

        long passedResults = resultRepository.countByResultStatus(
                ResultStatus.PASS);

        long failedResults = resultRepository.countByResultStatus(
                ResultStatus.FAIL);

        // Calculate pass percentage
        double passPercentage = 0.0;

        if (totalResults > 0) {

            passPercentage = ((double) passedResults / totalResults) * 100.0;

            passPercentage = Math.round(passPercentage * 100.0) / 100.0;
        }

        // Your rechecking counts
        long pendingRechecking = recheckingSubjectRepository.countByStatus(
                RecheckingStatus.PENDING);

        long approvedRechecking = recheckingSubjectRepository.countByStatus(
                RecheckingStatus.APPROVED);

        long rejectedRechecking = recheckingSubjectRepository.countByStatus(
                RecheckingStatus.REJECTED);

        long completedRechecking = recheckingSubjectRepository.countByStatus(
                RecheckingStatus.COMPLETED);

        List<Result> results = resultRepository.findAll();

        double averageSGPA = results.stream()
                .filter(result -> result.getSgpa() != null)
                .mapToDouble(Result::getSgpa)
                .average()
                .orElse(0.0);

        double averagePercentage = results.stream()
                .filter(result -> result.getPercentage() != null)
                .mapToDouble(Result::getPercentage)
                .average()
                .orElse(0.0);

        averageSGPA = Math.round(averageSGPA * 100.0) / 100.0;

        averagePercentage = Math.round(averagePercentage * 100.0) / 100.0;

        return AdminDashboardResponse.builder()

                .totalStudents(totalStudents)
                .totalTeachers(totalTeachers)
                .totalCourses(totalCourses)
                .totalSubjects(totalSubjects)
                .totalResults(totalResults)

                .pendingRechecking(pendingRechecking)
                .approvedRechecking(approvedRechecking)
                .rejectedRechecking(rejectedRechecking)
                .completedRechecking(completedRechecking)

                .passedResults(passedResults)
                .failedResults(failedResults)
                .passPercentage(passPercentage)
                .averageSGPA(averageSGPA)
                .averagePercentage(averagePercentage)

                .build();
    }
}