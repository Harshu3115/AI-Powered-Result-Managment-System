package com.srms.ai.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiChatResponse {

    private String question;

    private String answer;
}