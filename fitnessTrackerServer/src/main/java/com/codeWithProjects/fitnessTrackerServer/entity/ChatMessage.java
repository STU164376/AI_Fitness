package com.codeWithProjects.fitnessTrackerServer.entity;

import com.codeWithProjects.fitnessTrackerServer.dto.ChatMessageDTO;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String userMessage;

    @Column(columnDefinition = "TEXT")
    private String aiResponse;

    private LocalDateTime timestamp;

    public ChatMessageDTO getChatMessageDTO() {
        ChatMessageDTO dto = new ChatMessageDTO();
        dto.setId(id);
        dto.setUserMessage(userMessage);
        dto.setAiResponse(aiResponse);
        dto.setTimestamp(timestamp);
        return dto;
    }
}
