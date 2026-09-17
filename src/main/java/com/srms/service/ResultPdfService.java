package com.srms.service;

public interface ResultPdfService {

    byte[] generateMarksheet(Long resultId, String username);
}