package com.srms.service;

import org.springframework.web.multipart.MultipartFile;

public interface TeacherProfileImageService {

    String saveProfileImage(
            MultipartFile file,
            Long teacherId);

    void deleteProfileImage(String imagePath);
}