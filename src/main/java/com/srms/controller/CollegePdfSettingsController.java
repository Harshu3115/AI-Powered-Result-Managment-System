package com.srms.controller;

import com.srms.dto.request.CollegePdfSettingsRequest;
import com.srms.entity.CollegePdfSettings;
import com.srms.repository.CollegePdfSettingsRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/college-pdf-settings")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class CollegePdfSettingsController {

        private final CollegePdfSettingsRepository settingsRepository;

        @GetMapping
        public ResponseEntity<CollegePdfSettings> getSettings() {

                CollegePdfSettings settings = settingsRepository.findById(1L)
                                .orElseGet(this::createDefaultSettings);

                return ResponseEntity.ok(settings);
        }

        @PutMapping
        @Transactional
        public ResponseEntity<CollegePdfSettings> updateSettings(
                        @RequestBody CollegePdfSettingsRequest request) {

                CollegePdfSettings settings = settingsRepository.findById(1L)
                                .orElseGet(this::createDefaultSettings);

                settings.setSocietyName(request.getSocietyName());
                settings.setCollegeName(request.getCollegeName());
                settings.setAboutLine1(request.getAboutLine1());
                settings.setAboutLine2(request.getAboutLine2());
                settings.setAboutLine3(request.getAboutLine3());
                settings.setAccreditationText(request.getAccreditationText());
                settings.setInstituteCode(request.getInstituteCode());
                settings.setAcademicYear(request.getAcademicYear());
                settings.setPlace(request.getPlace());
                settings.setFooterMotto(request.getFooterMotto());

                settings.setLogoPath(request.getLogoPath());
                settings.setStampPath(request.getStampPath());
                settings.setSignaturePath(request.getSignaturePath());

                settings.setStampPosition(request.getStampPosition());
                settings.setSignaturePosition(request.getSignaturePosition());

                settings.setStampWidth(request.getStampWidth());
                settings.setStampHeight(request.getStampHeight());

                settings.setSignatureWidth(request.getSignatureWidth());
                settings.setSignatureHeight(request.getSignatureHeight());

                /*
                 * Existing entity is already managed by Hibernate.
                 * save() is not required here.
                 */
                return ResponseEntity.ok(settings);
        }

        private CollegePdfSettings createDefaultSettings() {

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
        }
}