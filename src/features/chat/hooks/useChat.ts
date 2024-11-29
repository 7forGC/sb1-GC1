import { useEffect } from 'react';
import { rootStore } from '../../../core/stores/rootStore';

export function useChat(conversationId?: string) {
  useEffect(() => {
    rootStore.chatStore.loadConversations();
  }, []);

  useEffect(() => {
    if (conversationId) {
      rootStore.chatStore.loadMessages(conversationId);
    }
  }, [conversationId]);

  return {
    conversations: Array.from(rootStore.chatStore.conversations.values()),
    messages: conversationId ? rootStore.chatStore.messages.get(conversationId) || [] : [],
    activeConversationId: rootStore.chatStore.activeConversationId,
    isLoading: rootStore.chatStore.isLoading,
    error: rootStore.chatStore.error,
    sendMessage: rootStore.chatStore.sendMessage.bind(rootStore.chatStore),
    markAsRead: rootStore.chatStore.markAsRead.bind(rootStore.chatStore),
    clearError: rootStore.chatStore.clearError.bind(rootStore.chatStore)
  };
}