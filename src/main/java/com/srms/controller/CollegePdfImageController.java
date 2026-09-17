package com.srms.controller;

import com.srms.entity.CollegePdfSettings;
import com.srms.repository.CollegePdfSettingsRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/college-pdf-settings")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class CollegePdfImageController {

        private final CollegePdfSettingsRepository settingsRepository;

        private final Path uploadDirectory = Paths.get("uploads/college-pdf");

        @PostMapping("/upload-logo")
        @Transactional
        public ResponseEntity<?> uploadLogo(
                        @RequestParam("file") MultipartFile file) throws IOException {

                String filePath = saveFile(file, "logo");

                CollegePdfSettings settings = getSettings();
                settings.setLogoPath(filePath);

                return ResponseEntity.ok(
                                Map.of(
                                                "message", "College logo uploaded successfully",
                                                "logoPath", filePath));
        }

        @PostMapping("/upload-stamp")
        @Transactional
        public ResponseEntity<?> uploadStamp(
                        @RequestParam("file") MultipartFile file) throws IOException {

                String filePath = saveFile(file, "stamp");

                CollegePdfSettings settings = getSettings();
                settings.setStampPath(filePath);

                return ResponseEntity.ok(
                                Map.of(
                                                "message", "College stamp uploaded successfully",
                                                "stampPath", filePath));
        }

        @PostMapping("/upload-signature")
        @Transactional
        public ResponseEntity<?> uploadSignature(
                        @RequestParam("file") MultipartFile file) throws IOException {

                String filePath = saveFile(file, "signature");

                CollegePdfSettings settings = getSettings();
                settings.setSignaturePath(filePath);

                return ResponseEntity.ok(
                                Map.of(
                                                "message", "Controller signature uploaded successfully",
                                                "signaturePath", filePath));
        }

        private String saveFile(
                        MultipartFile file,
                        String type) throws IOException {

                if (file == null || file.isEmpty()) {
                        throw new IllegalArgumentException(
                                        "Please select an image file");
                }

                String contentType = file.getContentType();

                if (contentType == null ||
                                !contentType.startsWith("image/")) {

                        throw new IllegalArgumentException(
                                        "Only image files are allowed");
                }

                Files.createDirectories(uploadDirectory);

                String originalFileName = file.getOriginalFilename();

                String extension = "";

                if (originalFileName != null &&
                                originalFileName.contains(".")) {

                        extension = originalFileName.substring(
                                        originalFileName.lastIndexOf("."));
                }

                String fileName = type + "-" + UUID.randomUUID() + extension;

                Path targetPath = uploadDirectory.resolve(fileName);

                Files.copy(
                                file.getInputStream(),
                                targetPath,
                                StandardCopyOption.REPLACE_EXISTING);

                return "/uploads/college-pdf/" + fileName;
        }

        private CollegePdfSettings getSettings() {

                return settingsRepository.findById(1L)
                                .orElseGet(() -> {

                                        CollegePdfSettings settings = new CollegePdfSettings();

                                        settings.setSocietyName("");
                                        settings.setCollegeName("");
                                        settings.setAboutLine1("");
                                        settings.setAboutLine2("");
                                        settings.setAboutLine3("");
                                        settings.setInstituteCode("");
                                        settings.setAcademicYear("");
                                        settings.setPlace("");
                                        settings.setFooterMotto("");

                                        settings.setStampPosition("CENTER");
                                        settings.setSignaturePosition("CENTER");

                                        settings.setStampWidth(100f);
                                        settings.setStampHeight(100f);

                                        settings.setSignatureWidth(130f);
                                        settings.setSignatureHeight(130f);

                                        settings.setLogoPath("");
                                        settings.setStampPath("");
                                        settings.setSignaturePath("");
                                        settings.setAccreditationText("");

                                        return settingsRepository.save(settings);
                                });
        }
}