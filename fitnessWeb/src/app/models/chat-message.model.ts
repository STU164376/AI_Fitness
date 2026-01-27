export interface ChatMessage {
  id?: number;
  userMessage: string;
  aiResponse: string;
  timestamp?: Date;
}
