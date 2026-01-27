package com.codeWithProjects.fitnessTrackerServer.services.chat;

import com.codeWithProjects.fitnessTrackerServer.dto.ChatMessageDTO;

import java.util.List;

public interface ChatService {

    ChatMessageDTO saveMessage(ChatMessageDTO dto);

    List<ChatMessageDTO> getChatHistory();
}
