package com.codeWithProjects.fitnessTrackerServer.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatMessageDTO {

    private Long id;

    private String userMessage;

    private String aiResponse;

    private LocalDateTime timestamp;
}
