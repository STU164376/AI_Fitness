import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { UserService } from '../../service/user.service';
import { GeminiService } from '../../service/gemini.service';
import { ChatMessage } from '../../models/chat-message.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, AfterViewChecked {

  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  messages: ChatMessage[] = [];
  userInput: string = '';
  isLoading: boolean = false;

  constructor(
    private userService: UserService,
    private geminiService: GeminiService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadChatHistory();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  loadChatHistory(): void {
    this.userService.getChatHistory().subscribe({
      next: (history) => {
        this.messages = history;
      },
      error: (err) => {
        console.error('Error loading chat history:', err);
      }
    });
  }

  async sendMessage(): Promise<void> {
    if (!this.userInput.trim() || this.isLoading) return;

    const userMessage = this.userInput.trim();
    this.userInput = '';
    this.isLoading = true;

    try {
      const aiResponse = await this.geminiService.generateResponse(userMessage);

      const chatMessage: ChatMessage = {
        userMessage: userMessage,
        aiResponse: aiResponse
      };

      this.userService.saveChatMessage(chatMessage).subscribe({
        next: (savedMessage) => {
          this.messages.push(savedMessage);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error saving message:', err);
          this.message.error('Failed to save message', { nzDuration: 5000 });
          this.isLoading = false;
        }
      });

    } catch (error) {
      console.error('Error getting AI response:', error);
      this.message.error('Failed to get AI response. Please check your API key.', { nzDuration: 5000 });
      this.isLoading = false;
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  formatMessage(text: string): string {
    if (!text) return '';

    let formatted = text
      // Escape HTML first
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Bold text **text**
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic text *text*
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Line breaks
      .replace(/\n/g, '<br>');

    // Handle bullet points
    formatted = formatted.replace(/(<br>)?[-•]\s(.+?)(?=<br>|$)/g, '<li>$2</li>');
    formatted = formatted.replace(/(<li>.*<\/li>)+/g, '<ul>$&</ul>');

    // Handle numbered lists
    formatted = formatted.replace(/(<br>)?\d+\.\s(.+?)(?=<br>|$)/g, '<li>$2</li>');

    return formatted;
  }
}
