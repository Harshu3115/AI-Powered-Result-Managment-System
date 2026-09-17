package com.srms.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.srms.service.TeacherProfileImageService;

@Service
public class TeacherProfileImageServiceImpl
        implements TeacherProfileImageService {

    private final Path uploadDirectory = Paths.get("uploads", "teachers");

    @Override
    public String saveProfileImage(
            MultipartFile file,
            Long teacherId) {

        if (file == null || file.isEmpty()) {
            return null;
        }

        // =====================================================
        // VALIDATE FILE TYPE
        // =====================================================

        String contentType = file.getContentType();

        if (contentType == null ||
                !contentType.startsWith("image/")) {

            throw new IllegalArgumentException(
                    "Only image files are allowed.");
        }

        // =====================================================
        // VALIDATE FILE SIZE
        // =====================================================

        if (file.getSize() > 5 * 1024 * 1024) {

            throw new IllegalArgumentException(
                    "Profile image must be less than 5 MB.");
        }

        try {

            // =================================================
            // CREATE DIRECTORY
            // =================================================

            Files.createDirectories(uploadDirectory);

            // =================================================
            // GET FILE EXTENSION
            // =================================================

            String originalName = file.getOriginalFilename();

            String extension = "";

            if (originalName != null &&
                    originalName.contains(".")) {

                extension = originalName.substring(
                        originalName.lastIndexOf(".")).toLowerCase();
            }

            // =================================================
            // UNIQUE FILE NAME
            // =================================================

            String fileName = "teacher_" +
                    teacherId +
                    "_" +
                    UUID.randomUUID() +
                    extension;

            // =================================================
            // SAVE FILE
            // =================================================

            Path targetPath = uploadDirectory.resolve(fileName);

            Files.copy(
                    file.getInputStream(),
                    targetPath,
                    StandardCopyOption.REPLACE_EXISTING);

            // =================================================
            // RETURN BROWSER URL
            // =================================================

            return "/uploads/teachers/" + fileName;

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to save profile image.",
                    e);
        }
    }

    @Override
    public void deleteProfileImage(
            String imagePath) {

        if (imagePath == null ||
                imagePath.isBlank()) {
            return;
        }

        try {

            String fileName = Paths.get(imagePath)
                    .getFileName()
                    .toString();

            Path path = uploadDirectory.resolve(fileName);

            Files.deleteIfExists(path);

        } catch (IOException e) {

            System.err.println(
                    "Unable to delete old profile image: "
                            + e.getMessage());
        }
    }
}