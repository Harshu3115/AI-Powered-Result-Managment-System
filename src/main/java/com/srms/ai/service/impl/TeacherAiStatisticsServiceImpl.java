package com.srms.ai.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.srms.ai.dto.response.TeacherAiStatisticsResponse;
import com.srms.ai.dto.response.TeacherAiStatisticsResponse.SubjectStatistics;
import com.srms.ai.service.TeacherAiStatisticsService;
import com.srms.entity.ResultSubject;
import com.srms.entity.Subject;
import com.srms.entity.Teacher;
import com.srms.entity.TeacherSubject;
import com.srms.entity.User;
import com.srms.enums.ResultStatus;
import com.srms.exception.ResourceNotFoundException;
import com.srms.repository.ResultSubjectRepository;
import com.srms.repository.TeacherRepository;
import com.srms.repository.TeacherSubjectRepository;
import com.srms.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TeacherAiStatisticsServiceImpl
        implements TeacherAiStatisticsService {

    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;
    private final TeacherSubjectRepository teacherSubjectRepository;
    private final ResultSubjectRepository resultSubjectRepository;

    @Override
    public TeacherAiStatisticsResponse generateStatistics(
            String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found."));

        Teacher teacher = teacherRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Teacher not found."));

        List<TeacherSubject> assignments = teacherSubjectRepository.findByTeacher(teacher);

        long totalAssignedSubjects = assignments.size();

        List<SubjectStatistics> subjectStatistics = new ArrayList<>();

        long totalAttempts = 0;
        long totalPassed = 0;
        long totalFailed = 0;

        double totalMarks = 0;
        double totalPercentage = 0;

        long marksCount = 0;
        long percentageCount = 0;

        for (TeacherSubject assignment : assignments) {

            Subject subject = assignment.getSubject();

            List<ResultSubject> resultSubjects = resultSubjectRepository
                    .findBySubjectId(subject.getId());

            if (resultSubjects.isEmpty()) {
                subjectStatistics.add(
                        SubjectStatistics.builder()
                                .subjectCode(
                                        subject.getSubjectCode())
                                .subjectName(
                                        subject.getSubjectName())
                                .totalAttempts(0)
                                .passedAttempts(0)
                                .failedAttempts(0)
                                .passPercentage(0)
                                .averageMarks(0)
                                .averagePercentage(0)
                                .build());

                continue;
            }

            int subjectAttempts = resultSubjects.size();

            int subjectPassed = 0;

            double subjectMarks = 0;
            double subjectPercentage = 0;

            int subjectMarksCount = 0;
            int subjectPercentageCount = 0;

            for (ResultSubject resultSubject : resultSubjects) {

                Integer obtainedMarks = resultSubject.getObtainedMarks();

                Double percentage = resultSubject.getPercentage();

                if (obtainedMarks != null) {

                    subjectMarks += obtainedMarks;
                    subjectMarksCount++;

                    totalMarks += obtainedMarks;
                    marksCount++;
                }

                if (percentage != null) {

                    subjectPercentage += percentage;
                    subjectPercentageCount++;

                    totalPercentage += percentage;
                    percentageCount++;
                }

                if (isPassed(resultSubject)) {
                    subjectPassed++;
                }
            }

            int subjectFailed = subjectAttempts - subjectPassed;

            double subjectPassPercentage = subjectAttempts == 0
                    ? 0
                    : subjectPassed * 100.0
                            / subjectAttempts;

            double averageMarks = subjectMarksCount == 0
                    ? 0
                    : subjectMarks
                            / subjectMarksCount;

            double averagePercentage = subjectPercentageCount == 0
                    ? 0
                    : subjectPercentage
                            / subjectPercentageCount;

            totalAttempts += subjectAttempts;
            totalPassed += subjectPassed;
            totalFailed += subjectFailed;

            subjectStatistics.add(
                    SubjectStatistics.builder()
                            .subjectCode(
                                    subject.getSubjectCode())
                            .subjectName(
                                    subject.getSubjectName())
                            .totalAttempts(subjectAttempts)
                            .passedAttempts(subjectPassed)
                            .failedAttempts(subjectFailed)
                            .passPercentage(
                                    round(subjectPassPercentage))
                            .averageMarks(
                                    round(averageMarks))
                            .averagePercentage(
                                    round(averagePercentage))
                            .build());
        }

        double overallPassPercentage = totalAttempts == 0
                ? 0
                : totalPassed * 100.0
                        / totalAttempts;

        double overallAverageMarks = marksCount == 0
                ? 0
                : totalMarks / marksCount;

        double overallAveragePercentage = percentageCount == 0
                ? 0
                : totalPercentage
                        / percentageCount;

        return TeacherAiStatisticsResponse.builder()
                .totalAssignedSubjects(totalAssignedSubjects)
                .totalStudentAttempts(totalAttempts)
                .passedAttempts(totalPassed)
                .failedAttempts(totalFailed)
                .passPercentage(
                        round(overallPassPercentage))
                .averageMarks(
                        round(overallAverageMarks))
                .averagePercentage(
                        round(overallAveragePercentage))
                .subjectStatistics(subjectStatistics)
                .build();
    }

    private boolean isPassed(
            ResultSubject resultSubject) {

        if (resultSubject.getResult() == null) {
            return false;
        }

        if (resultSubject.getResult()
                .getResultStatus() == null) {
            return false;
        }

        return resultSubject.getResult()
                .getResultStatus() == ResultStatus.PASS;
    }

    private double round(double value) {

        return Math.round(value * 100.0) / 100.0;
    }
}