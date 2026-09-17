package com.srms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.srms.entity.AdminNotification;

public interface AdminNotificationRepository
        extends JpaRepository<AdminNotification, Long> {

    List<AdminNotification> findAllByOrderByCreatedAtDesc();

    List<AdminNotification> findByIsReadFalseOrderByCreatedAtDesc();

    long countByIsReadFalse();
}