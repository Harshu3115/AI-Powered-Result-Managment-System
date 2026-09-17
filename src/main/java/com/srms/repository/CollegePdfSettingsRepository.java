package com.srms.repository;

import com.srms.entity.CollegePdfSettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CollegePdfSettingsRepository
        extends JpaRepository<CollegePdfSettings, Long> {
}