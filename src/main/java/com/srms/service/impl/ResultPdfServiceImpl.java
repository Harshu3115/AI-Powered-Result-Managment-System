package com.srms.service.impl;

import java.io.ByteArrayOutputStream;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.stereotype.Service;

import java.awt.Color;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;

import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.srms.entity.CollegePdfSettings;
import com.srms.entity.Result;
import com.srms.entity.ResultSubject;
import com.srms.entity.Student;
import com.srms.entity.User;

import com.srms.exception.BadRequestException;
import com.srms.exception.ResourceNotFoundException;
import com.srms.repository.CollegePdfSettingsRepository;
import com.srms.repository.ResultRepository;
import com.srms.repository.StudentRepository;
import com.srms.repository.UserRepository;

import com.srms.service.ResultPdfService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ResultPdfServiceImpl implements ResultPdfService {

        private final ResultRepository resultRepository;
        private final UserRepository userRepository;
        private final StudentRepository studentRepository;
        private final CollegePdfSettingsRepository settingsRepository;
        private final Path uploadDirectory = Paths.get("uploads/college-pdf");

        @Override
        public byte[] generateMarksheet(
                        Long resultId,
                        String username) {

                // =========================================================
                // FIND USER
                // =========================================================

                User user = userRepository
                                .findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found."));

                // =========================================================
                // FIND STUDENT
                // =========================================================

                Student student = studentRepository
                                .findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Student not found."));

                // =========================================================
                // FIND RESULT
                // =========================================================

                Result result = resultRepository
                                .findById(resultId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Result not found."));

                // =========================================================
                // SECURITY CHECK
                // =========================================================

                if (!result.getStudent()
                                .getId()
                                .equals(student.getId())) {

                        throw new BadRequestException(
                                        "You are not allowed to download this marksheet.");
                }

                // =========================================================
                // FIND COLLEGE PDF SETTINGS
                // =========================================================

                CollegePdfSettings settings = settingsRepository.findById(1L)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "College PDF settings not configured."));

                try {

                        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

                        // =====================================================
                        // DOCUMENT
                        // =====================================================

                        Document document = new Document(
                                        PageSize.A4,
                                        28,
                                        28,
                                        28,
                                        28);

                        PdfWriter writer = PdfWriter.getInstance(
                                        document,
                                        outputStream);

                        document.open();

                        // =====================================================
                        // FONTS
                        // =====================================================

                        BaseFont robotoSlabBaseFont = BaseFont.createFont(
                                        "fonts/RobotoSlab-Light.ttf",
                                        BaseFont.IDENTITY_H,
                                        BaseFont.EMBEDDED);

                        Font collegeEdcNameFont = new Font(
                                        robotoSlabBaseFont,
                                        9,
                                        Font.BOLD,
                                        new Color(15, 45, 85));

                        Font collegeNameFont = new Font(
                                        robotoSlabBaseFont,
                                        13,
                                        Font.BOLD,
                                        new Color(34, 178, 239));

                        Font collegeSubFont = new Font(

                                        robotoSlabBaseFont,
                                        15,
                                        Font.BOLD,
                                        new Color(15, 45, 85));

                        Font autonomousFont = new Font(
                                        robotoSlabBaseFont,
                                        10,
                                        Font.BOLD,
                                        new Color(20, 20, 20));

                        Font affiliationFont = new Font(
                                        robotoSlabBaseFont,
                                        8.5f,
                                        Font.NORMAL,
                                        new Color(30, 30, 30));

                        Font marksheetFont = new Font(
                                        Font.HELVETICA,
                                        17,
                                        Font.BOLD,
                                        new Color(15, 45, 85));

                        Font sectionFont = new Font(
                                        Font.HELVETICA,
                                        10,
                                        Font.BOLD,
                                        new Color(15, 45, 85));

                        Font normalFont = new Font(
                                        Font.HELVETICA,
                                        9,
                                        Font.NORMAL,
                                        new Color(30, 30, 30));

                        Font boldFont = new Font(
                                        Font.HELVETICA,
                                        9,
                                        Font.BOLD,
                                        new Color(20, 20, 20));

                        Font tableHeaderFont = new Font(
                                        Font.HELVETICA,
                                        8,
                                        Font.BOLD,
                                        new Color(15, 45, 85));

                        Font tableFont = new Font(
                                        Font.HELVETICA,
                                        7.5f,
                                        Font.NORMAL,
                                        new Color(20, 20, 20));

                        Font passFont = new Font(
                                        Font.HELVETICA,
                                        15,
                                        Font.BOLD,
                                        new Color(20, 120, 50));

                        // =====================================================
                        // COLLEGE HEADER
                        // =====================================================

                        PdfPTable headerTable = new PdfPTable(2);

                        headerTable.setWidthPercentage(100);

                        headerTable.setWidths(
                                        new float[] {
                                                        1.2f,
                                                        6.8f
                                        });

                        // -----------------------------------------------------
                        // LOGO
                        // -----------------------------------------------------

                        PdfPCell logoCell = new PdfPCell();

                        logoCell.setBorder(
                                        Rectangle.NO_BORDER);

                        logoCell.setHorizontalAlignment(
                                        Element.ALIGN_CENTER);

                        logoCell.setVerticalAlignment(
                                        Element.ALIGN_MIDDLE);

                        try {
                                if (settings.getLogoPath() != null
                                                && !settings.getLogoPath().isBlank()) {

                                        String logoPath = getActualImagePath(settings.getLogoPath());

                                        if (logoPath != null) {
                                                Image logo = Image.getInstance(logoPath);

                                                logo.scaleToFit(105, 105);

                                                logoCell.addElement(logo);
                                        }
                                }

                        } catch (Exception e) {
                                e.printStackTrace();

                                System.out.println(
                                                "Logo image loading failed: "
                                                                + settings.getLogoPath());
                        }

                        headerTable.addCell(
                                        logoCell);

                        // -----------------------------------------------------
                        // COLLEGE INFORMATION
                        // -----------------------------------------------------

                        PdfPCell collegeCell = new PdfPCell();

                        collegeCell.setBorder(
                                        Rectangle.NO_BORDER);

                        collegeCell.setHorizontalAlignment(
                                        Element.ALIGN_CENTER);

                        collegeCell.setVerticalAlignment(
                                        Element.ALIGN_MIDDLE);
                        collegeCell.setPaddingLeft(25f);

                        Paragraph society = new Paragraph(
                                        settings.getSocietyName(),
                                        collegeEdcNameFont);
                        society.setAlignment(Element.ALIGN_LEFT);
                        collegeCell.addElement(society);

                        Paragraph college = new Paragraph(
                                        settings.getCollegeName(),
                                        collegeNameFont);
                        college.setAlignment(Element.ALIGN_LEFT);
                        collegeCell.addElement(college);

                        addCollegeLine(
                                        collegeCell,
                                        settings.getAboutLine1(),
                                        affiliationFont);

                        addCollegeLine(
                                        collegeCell,
                                        settings.getAboutLine2(),
                                        affiliationFont);

                        addCollegeLine(
                                        collegeCell,
                                        settings.getAboutLine3(),
                                        affiliationFont);

                        Paragraph accreditation = new Paragraph(
                                        settings.getAccreditationText(),
                                        affiliationFont);
                        accreditation.setAlignment(Element.ALIGN_LEFT);
                        collegeCell.addElement(accreditation);

                        headerTable.addCell(
                                        collegeCell);

                        document.add(
                                        headerTable);

                        // =====================================================
                        // SEPARATOR
                        // =====================================================

                        Paragraph separator = new Paragraph(
                                        " ");

                        document.add(
                                        separator);

                        // =====================================================
                        // MARKSHEET TITLE
                        // =====================================================

                        PdfPTable titleTable = new PdfPTable(1);

                        titleTable.setWidthPercentage(82);

                        PdfPCell titleCell = new PdfPCell(
                                        new Phrase(
                                                        getExaminationTitle(result),
                                                        marksheetFont));

                        titleCell.setBackgroundColor(
                                        new Color(220, 235, 248));

                        titleCell.setHorizontalAlignment(
                                        Element.ALIGN_CENTER);

                        titleCell.setVerticalAlignment(
                                        Element.ALIGN_LEFT);

                        titleCell.setPadding(
                                        8);

                        titleCell.setBorder(
                                        Rectangle.NO_BORDER);

                        titleTable.addCell(
                                        titleCell);

                        document.add(
                                        titleTable);

                        document.add(
                                        new Paragraph(" "));

                        // =====================================================
                        // STUDENT INFORMATION
                        // =====================================================

                        PdfPTable studentTable = new PdfPTable(4);

                        studentTable.setWidthPercentage(100);

                        studentTable.setWidths(
                                        new float[] {
                                                        1.3f,
                                                        3.2f,
                                                        1.4f,
                                                        2.8f
                                        });

                        addInfoRow(
                                        studentTable,
                                        "Student Name",
                                        result.getStudent()
                                                        .getFirstName()
                                                        + " "
                                                        + result.getStudent()
                                                                        .getLastName(),
                                        "Semester",
                                        result.getSemester()
                                                        .getSemesterName(),
                                        boldFont,
                                        normalFont);

                        addInfoRow(
                                        studentTable,
                                        "Roll Number",
                                        String.valueOf(
                                                        result.getStudent()
                                                                        .getRollNo()),
                                        "Academic Year",
                                        settings.getAcademicYear(),
                                        boldFont,
                                        normalFont);

                        addInfoRow(
                                        studentTable,
                                        "PRN Number",
                                        String.valueOf(
                                                        result.getStudent()
                                                                        .getPrnNo()),
                                        "Examination",
                                        getExaminationTitle(result),
                                        boldFont,
                                        normalFont);

                        addInfoRow(
                                        studentTable,
                                        "Course",
                                        result.getSemester()
                                                        .getCourse()
                                                        .getCourseName(),
                                        "Institute Code",
                                        settings.getInstituteCode(),
                                        boldFont,
                                        normalFont);

                        addInfoRow(
                                        studentTable,
                                        "Department",
                                        result.getSemester()
                                                        .getCourse()
                                                        .getDepartment()
                                                        .getDepartmentName(),
                                        "",
                                        "",
                                        boldFont,
                                        normalFont);

                        document.add(
                                        studentTable);

                        document.add(
                                        new Paragraph(" "));

                        // =====================================================
                        // RESULT TABLE
                        // =====================================================

                        PdfPTable table = new PdfPTable(8);

                        table.setWidthPercentage(100);

                        table.setWidths(
                                        new float[] {
                                                        1.2f,
                                                        2.7f,
                                                        1.0f,
                                                        1.0f,
                                                        1.2f,
                                                        1.4f,
                                                        1.3f,
                                                        1.2f
                                        });

                        String[] headers = {
                                        "Code",
                                        "Subject",
                                        "Credits",
                                        "Total\nMarks",
                                        "Obtained\nMarks",
                                        "Percentage\n(%)",
                                        "Grade",
                                        "Grade\nPoint"
                        };

                        for (String header : headers) {

                                PdfPCell cell = new PdfPCell(
                                                new Phrase(
                                                                header,
                                                                tableHeaderFont));

                                cell.setBackgroundColor(
                                                new Color(
                                                                220,
                                                                235,
                                                                248));

                                cell.setHorizontalAlignment(
                                                Element.ALIGN_CENTER);

                                cell.setVerticalAlignment(
                                                Element.ALIGN_MIDDLE);

                                cell.setPadding(
                                                5);

                                table.addCell(
                                                cell);
                        }

                        // =====================================================
                        // SUBJECT DATA
                        // =====================================================

                        for (ResultSubject rs : result.getResultSubjects()) {

                                addTableCell(
                                                table,
                                                rs.getSubject()
                                                                .getSubjectCode(),
                                                tableFont);

                                addTableCell(
                                                table,
                                                rs.getSubject()
                                                                .getSubjectName(),
                                                tableFont);

                                addTableCell(
                                                table,
                                                String.valueOf(
                                                                rs.getCredits()),
                                                tableFont);

                                addTableCell(
                                                table,
                                                String.valueOf(
                                                                rs.getTotalMarks()),
                                                tableFont);

                                addTableCell(
                                                table,
                                                String.valueOf(
                                                                rs.getObtainedMarks()),
                                                tableFont);

                                addTableCell(
                                                table,
                                                String.format(
                                                                "%.2f",
                                                                rs.getPercentage()),
                                                tableFont);

                                addTableCell(
                                                table,
                                                rs.getGrade() != null
                                                                ? rs.getGrade().name()
                                                                : "",
                                                tableFont);

                                addTableCell(
                                                table,
                                                String.valueOf(
                                                                rs.getGradePoint()),
                                                tableFont);
                        }

                        document.add(
                                        table);

                        document.add(
                                        new Paragraph(" "));

                        // =====================================================
                        // RESULT SUMMARY
                        // =====================================================

                        PdfPTable summaryTable = new PdfPTable(2);

                        summaryTable.setWidthPercentage(
                                        100);

                        summaryTable.setWidths(
                                        new float[] {
                                                        5.2f,
                                                        3.8f
                                        });

                        // -----------------------------------------------------
                        // LEFT SUMMARY
                        // -----------------------------------------------------

                        PdfPCell summaryLeft = new PdfPCell();

                        summaryLeft.setPadding(
                                        10);

                        summaryLeft.setBackgroundColor(
                                        new Color(
                                                        238,
                                                        246,
                                                        252));

                        addSummaryParagraph(
                                        summaryLeft,
                                        "Total Marks",
                                        String.valueOf(
                                                        result.getTotalMarks()),
                                        boldFont,
                                        normalFont);

                        addSummaryParagraph(
                                        summaryLeft,
                                        "Obtained Marks",
                                        String.valueOf(
                                                        result.getObtainedMarks()),
                                        boldFont,
                                        normalFont);

                        addSummaryParagraph(
                                        summaryLeft,
                                        "Percentage",
                                        String.valueOf(
                                                        result.getPercentage())
                                                        + "%",
                                        boldFont,
                                        normalFont);

                        addSummaryParagraph(
                                        summaryLeft,
                                        "SGPA",
                                        String.valueOf(
                                                        result.getSgpa()),
                                        boldFont,
                                        normalFont);

                        summaryTable.addCell(
                                        summaryLeft);

                        // -----------------------------------------------------
                        // RESULT STATUS
                        // -----------------------------------------------------

                        PdfPCell statusCell = new PdfPCell();

                        statusCell.setHorizontalAlignment(
                                        Element.ALIGN_CENTER);

                        statusCell.setVerticalAlignment(
                                        Element.ALIGN_MIDDLE);

                        statusCell.setPadding(
                                        15);

                        String status = result.getResultStatus() != null
                                        ? result.getResultStatus()
                                                        .name()
                                        : "";

                        Paragraph statusParagraph = new Paragraph();

                        statusParagraph.add(
                                        new Phrase(
                                                        "Result Status : ",
                                                        sectionFont));

                        statusParagraph.add(
                                        new Phrase(
                                                        status,
                                                        passFont));

                        statusParagraph.setAlignment(
                                        Element.ALIGN_CENTER);

                        statusCell.addElement(
                                        statusParagraph);

                        summaryTable.addCell(
                                        statusCell);

                        document.add(
                                        summaryTable);

                        document.add(
                                        new Paragraph(" "));

                        document.add(
                                        new Paragraph(" "));

                        // =====================================================
                        // DATE / COLLEGE STAMP / SIGNATURE
                        // =====================================================

                        PdfPTable footerTable = new PdfPTable(3);

                        footerTable.setWidthPercentage(100);

                        footerTable.setWidths(
                                        new float[] {
                                                        4.5f, // Date / Place
                                                        2.0f, // College Stamp
                                                        3.5f // Signature
                                        });

                        // =====================================================
                        // DATE / PLACE
                        // =====================================================

                        PdfPCell dateCell = new PdfPCell();

                        dateCell.setBorder(
                                        Rectangle.NO_BORDER);

                        dateCell.setVerticalAlignment(
                                        Element.ALIGN_BOTTOM);

                        Paragraph date = new Paragraph(
                                        "Date of Issue : "
                                                        + java.time.LocalDate.now().toString(),
                                        normalFont);

                        dateCell.addElement(date);

                        Paragraph place = new Paragraph(
                                        "Place : " + settings.getPlace(),
                                        normalFont);

                        dateCell.addElement(place);

                        footerTable.addCell(dateCell);

                        // =====================================================
                        // COLLEGE STAMP
                        // =====================================================

                        PdfPCell stampCell = new PdfPCell();

                        stampCell.setBorder(
                                        Rectangle.NO_BORDER);

                        stampCell.setHorizontalAlignment(
                                        Element.ALIGN_CENTER);

                        stampCell.setVerticalAlignment(
                                        Element.ALIGN_BOTTOM);

                        try {
                                if (settings.getStampPath() != null
                                                && !settings.getStampPath().isBlank()) {

                                        String stampPath = getActualImagePath(settings.getStampPath());

                                        if (stampPath != null) {
                                                Image collegeStamp = Image.getInstance(stampPath);

                                                collegeStamp.scaleToFit(
                                                                settings.getStampWidth() != null
                                                                                ? settings.getStampWidth()
                                                                                : 100f,

                                                                settings.getStampHeight() != null
                                                                                ? settings.getStampHeight()
                                                                                : 100f);

                                                collegeStamp.setAlignment(
                                                                getAlignment(
                                                                                settings.getStampPosition()));

                                                stampCell.addElement(collegeStamp);
                                        }
                                }

                        } catch (Exception e) {
                                e.printStackTrace();

                                System.out.println(
                                                "Stamp image loading failed: "
                                                                + settings.getStampPath());
                        }

                        // =====================================================
                        // STAMP LINE
                        // =====================================================

                        Paragraph stampLine = new Paragraph(
                                        "________________",
                                        normalFont);

                        stampLine.setAlignment(
                                        Element.ALIGN_CENTER);

                        stampCell.addElement(
                                        stampLine);

                        // =====================================================
                        // INSTITUTE STAMP TEXT
                        // =====================================================

                        Paragraph stampText = new Paragraph(
                                        "Institute Stamp",
                                        boldFont);

                        stampText.setAlignment(
                                        Element.ALIGN_CENTER);

                        stampCell.addElement(
                                        stampText);

                        // =====================================================
                        // ADD STAMP CELL
                        // =====================================================

                        footerTable.addCell(
                                        stampCell);

                        // =====================================================
                        // CONTROLLER OF EXAMINATIONS
                        // =====================================================

                        PdfPCell signatureCell = new PdfPCell();

                        signatureCell.setBorder(
                                        Rectangle.NO_BORDER);

                        signatureCell.setHorizontalAlignment(
                                        Element.ALIGN_CENTER);

                        signatureCell.setVerticalAlignment(
                                        Element.ALIGN_BOTTOM);

                        // =====================================================
                        // SIGNATURE IMAGE
                        // =====================================================

                        try {
                                if (settings.getSignaturePath() != null
                                                && !settings.getSignaturePath().isBlank()) {

                                        String signaturePath = getActualImagePath(
                                                        settings.getSignaturePath());

                                        if (signaturePath != null) {
                                                Image signature = Image.getInstance(signaturePath);

                                                signature.scaleToFit(
                                                                settings.getSignatureWidth() != null
                                                                                ? settings.getSignatureWidth()
                                                                                : 130f,

                                                                settings.getSignatureHeight() != null
                                                                                ? settings.getSignatureHeight()
                                                                                : 130f);

                                                signature.setAlignment(
                                                                getAlignment(
                                                                                settings.getSignaturePosition()));

                                                signatureCell.addElement(signature);
                                        }
                                }

                        } catch (Exception e) {
                                e.printStackTrace();

                                System.out.println(
                                                "Signature image loading failed: "
                                                                + settings.getSignaturePath());
                        }

                        // =====================================================
                        // SIGNATURE LINE
                        // =====================================================

                        Paragraph line = new Paragraph(
                                        "________________________",
                                        normalFont);

                        line.setAlignment(
                                        Element.ALIGN_CENTER);

                        signatureCell.addElement(
                                        line);

                        // =====================================================
                        // CONTROLLER OF EXAMINATIONS
                        // =====================================================

                        Paragraph controller = new Paragraph(
                                        "Controller of Examinations",
                                        boldFont);

                        controller.setAlignment(
                                        Element.ALIGN_CENTER);

                        signatureCell.addElement(
                                        controller);

                        footerTable.addCell(
                                        signatureCell);

                        // =====================================================
                        // ADD FOOTER TABLE
                        // =====================================================

                        document.add(
                                        footerTable);

                        // =====================================================
                        // FOOTER MOTTO
                        // =====================================================

                        document.add(
                                        new Paragraph(" "));

                        Paragraph motto = new Paragraph(
                                        settings.getFooterMotto(),
                                        new Font(
                                                        Font.HELVETICA,
                                                        9,
                                                        Font.ITALIC,
                                                        new Color(15, 45, 85)));

                        motto.setAlignment(
                                        Element.ALIGN_CENTER);

                        document.add(
                                        motto);

                        // =====================================================
                        // CLOSE
                        // =====================================================

                        document.close();

                        return outputStream.toByteArray();

                } catch (Exception e) {

                        throw new RuntimeException(
                                        "Failed to generate marksheet PDF.",
                                        e);
                }

        }

        // =============================================================
        // ADD STUDENT INFORMATION ROW
        // =============================================================

        private void addInfoRow(
                        PdfPTable table,
                        String label1,
                        String value1,
                        String label2,
                        String value2,
                        Font labelFont,
                        Font valueFont) {

                PdfPCell labelCell1 = new PdfPCell(
                                new Phrase(
                                                label1,
                                                labelFont));

                labelCell1.setPadding(
                                5);

                table.addCell(
                                labelCell1);

                PdfPCell valueCell1 = new PdfPCell(
                                new Phrase(
                                                value1 != null
                                                                ? value1
                                                                : "",
                                                valueFont));

                valueCell1.setPadding(
                                5);

                table.addCell(
                                valueCell1);

                PdfPCell labelCell2 = new PdfPCell(
                                new Phrase(
                                                label2 != null
                                                                ? label2
                                                                : "",
                                                labelFont));

                labelCell2.setPadding(
                                5);

                table.addCell(
                                labelCell2);

                PdfPCell valueCell2 = new PdfPCell(
                                new Phrase(
                                                value2 != null
                                                                ? value2
                                                                : "",
                                                valueFont));

                valueCell2.setPadding(
                                5);

                table.addCell(
                                valueCell2);
        }

        // =============================================================
        // ADD TABLE CELL
        // =============================================================

        private void addTableCell(
                        PdfPTable table,
                        String value,
                        Font font) {

                PdfPCell cell = new PdfPCell(
                                new Phrase(
                                                value != null
                                                                ? value
                                                                : "",
                                                font));

                cell.setHorizontalAlignment(
                                Element.ALIGN_CENTER);

                cell.setVerticalAlignment(
                                Element.ALIGN_MIDDLE);

                cell.setPadding(
                                4);

                table.addCell(
                                cell);
        }

        // =============================================================
        // ADD SUMMARY ROW
        // =============================================================

        private void addSummaryParagraph(
                        PdfPCell cell,
                        String label,
                        String value,
                        Font labelFont,
                        Font valueFont) {

                Paragraph paragraph = new Paragraph();

                paragraph.add(
                                new Phrase(
                                                label + " : ",
                                                labelFont));

                paragraph.add(
                                new Phrase(
                                                value,
                                                valueFont));

                cell.addElement(
                                paragraph);
        }

        private String getExaminationTitle(Result result) {

                if (result == null || result.getExamMode() == null) {
                        return "SEMESTER EXAMINATION";
                }

                return switch (result.getExamMode()) {
                        case SUMMER -> "SUMMER SEMESTER EXAMINATION";
                        case WINTER -> "WINTER SEMESTER EXAMINATION";
                };
        }

        private int getAlignment(String position) {

                if (position == null) {
                        return Element.ALIGN_CENTER;
                }

                return switch (position.toUpperCase()) {

                        case "LEFT" ->
                                Element.ALIGN_LEFT;

                        case "RIGHT" ->
                                Element.ALIGN_RIGHT;

                        default ->
                                Element.ALIGN_CENTER;
                };
        }

        private void addCollegeLine(
                        PdfPCell cell,
                        String text,
                        Font font) {

                if (text != null && !text.trim().isEmpty()) {
                        Paragraph paragraph = new Paragraph(text, font);
                        paragraph.setAlignment(Element.ALIGN_LEFT);
                        cell.addElement(paragraph);
                }
        }

        private String getActualImagePath(String databasePath) {

                if (databasePath == null || databasePath.isBlank()) {
                        return null;
                }

                String fileName = Paths.get(databasePath)
                                .getFileName()
                                .toString();

                Path actualPath = uploadDirectory.resolve(fileName);

                if (!Files.exists(actualPath)) {
                        System.out.println(
                                        "Image file not found: "
                                                        + actualPath.toAbsolutePath());

                        return null;
                }

                return actualPath.toAbsolutePath().toString();
        }

}