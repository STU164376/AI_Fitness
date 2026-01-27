package com.codeWithProjects.fitnessTrackerServer.services.chat;

import com.codeWithProjects.fitnessTrackerServer.dto.ChatMessageDTO;
import com.codeWithProjects.fitnessTrackerServer.entity.ChatMessage;
import com.codeWithProjects.fitnessTrackerServer.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatMessageRepository chatMessageRepository;

    @Override
    public ChatMessageDTO saveMessage(ChatMessageDTO dto) {
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setUserMessage(dto.getUserMessage());
        chatMessage.setAiResponse(dto.getAiResponse());
        chatMessage.setTimestamp(LocalDateTime.now());

        return chatMessageRepository.save(chatMessage).getChatMessageDTO();
    }

    @Override
    public List<ChatMessageDTO> getChatHistory() {
        List<ChatMessage> messages = chatMessageRepository.findAllByOrderByTimestampAsc();
        return messages.stream()
                .map(ChatMessage::getChatMessageDTO)
                .collect(Collectors.toList());
    }
}
