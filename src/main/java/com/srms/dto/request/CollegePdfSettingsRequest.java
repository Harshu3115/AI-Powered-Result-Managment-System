package com.srms.dto.request;

import lombok.Data;

@Data
public class CollegePdfSettingsRequest {

    private String societyName;

    private String collegeName;

    private String aboutLine1;
    private String aboutLine2;
    private String aboutLine3;

    private String accreditationText;

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
}