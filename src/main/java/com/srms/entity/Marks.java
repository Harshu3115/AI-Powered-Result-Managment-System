package com.srms.entity;

import com.srms.enums.DBATUGrade;
import com.srms.enums.Grade;
import com.srms.enums.ResultStatus;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "marks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Marks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    @Column(nullable = false)
    private Integer internalMarks;

    @Column(nullable = false)
    private Integer externalMarks;

    @Column(nullable = false)
    private Integer totalMarks;

    @Enumerated(EnumType.STRING)
    private DBATUGrade grade;

    @Enumerated(EnumType.STRING)
    private ResultStatus resultStatus;

}