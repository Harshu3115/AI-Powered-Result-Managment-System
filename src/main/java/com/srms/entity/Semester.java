package com.srms.entity;

import java.util.List;

import com.srms.enums.ExamMode;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "semesters")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Semester {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Semester Number is required")
    @Min(1)
    @Max(10)
    private Integer semesterNumber;

    @Column(length = 100)
    private String semesterName;

    @Enumerated(EnumType.STRING)
    @Column(name = "exam_mode", nullable = false)
    private ExamMode examMode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @OneToMany(mappedBy = "semester", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Subject> subjects;

}