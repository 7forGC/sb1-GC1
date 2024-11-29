import { makeAutoObservable } from 'mobx';
import { Message } from '../types/message';
import { websocketService } from '../services/websocketService';

export class MessageStore {
  messages: Map<string, Message[]> = new Map();
  activeConversationId: string | null = null;
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setActiveConversation(conversationId: string) {
    this.activeConversationId = conversationId;
  }

  addMessage(message: Message) {
    const conversationMessages = this.messages.get(message.conversationId) || [];
    this.messages.set(message.conversationId, [message, ...conversationMessages]);
  }

  markMessageAsRead(messageId: string) {
    this.messages.forEach((messages, conversationId) => {
      const updatedMessages = messages.map(msg =>
        msg.id === messageId ? { ...msg, isRead: true } : msg
      );
      this.messages.set(conversationId, updatedMessages);
    });
  }

  async sendMessage(conversationId: string, content: string) {
    try {
      websocketService.sendMessage(conversationId, {
        content,
        timestamp: new Date(),
      });
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to send message';
    }
  }

  clearError() {
    this.error = null;
  }
}

export const messageStore = new MessageStore();