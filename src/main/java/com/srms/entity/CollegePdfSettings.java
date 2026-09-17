package com.srms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "college_pdf_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollegePdfSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String societyName;

    private String collegeName;

    @Column(length = 2000)
    private String aboutLine1;

    @Column(length = 2000)
    private String aboutLine2;

    @Column(length = 2000)
    private String aboutLine3;

    private String instituteCode;

    private String academicYear;

    private String place;

    private String footerMotto;

    private String logoPath;

    private String stampPath;

    private String signaturePath;

    private String stampPosition;

    private String signaturePosition;

    private Float stampWidth;

    private Float stampHeight;

    private Float signatureWidth;

    private Float signatureHeight;

    private String accreditationText;
}