package com.srms.entity;

import com.srms.enums.SubjectType;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import com.srms.enums.SubjectType;

@Entity
@Table(name = "subjects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Subject Code is required")
    @Column(nullable = false, unique = true, length = 20)
    private String subjectCode;

    @NotBlank(message = "Subject Name is required")
    @Column(nullable = false, length = 100)
    private String subjectName;

    @NotNull(message = "Credits are required")
    @Min(1)
    @Max(10)
    private Integer credits;

    @NotNull(message = "Internal Max Marks is required")
    @Min(0)
    @Max(100)
    private Integer internalMaxMarks;

    @NotNull(message = "External Max Marks is required")
    @Min(0)
    @Max(100)
    private Integer externalMaxMarks;

    @NotNull(message = "Passing Marks is required")
    @Min(0)
    @Max(100)
    private Integer passingMarks;

    @NotNull(message = "Subject Type is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubjectType subjectType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "semester_id", nullable = false)
    private Semester semester;
    
    @OneToMany(
            mappedBy = "subject",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Marks> marks = new ArrayList<>();
}