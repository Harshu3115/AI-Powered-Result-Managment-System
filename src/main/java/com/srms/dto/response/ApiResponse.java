package com.srms.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {

	private Boolean success;

    private String message;

    private T data;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

}