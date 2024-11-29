import { makeAutoObservable, runInAction } from 'mobx';
import { supabase } from '../../../lib/supabase';
import type { Message, Conversation } from '../types';

export class ChatStore {
  conversations = new Map<string, Conversation>();
  messages = new Map<string, Message[]>();
  activeConversationId: string | null = null;
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.initializeRealtime();
  }

  private initializeRealtime() {
    supabase
      .channel('chat_messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        this.handleNewMessage(payload.new as Message);
      })
      .subscribe();
  }

  private handleNewMessage(message: Message) {
    runInAction(() => {
      const conversationMessages = this.messages.get(message.conversationId) || [];
      this.messages.set(message.conversationId, [message, ...conversationMessages]);

      const conversation = this.conversations.get(message.conversationId);
      if (conversation) {
        conversation.lastMessage = message;
        conversation.unreadCount += 1;
      }
    });
  }

  async loadConversations() {
    try {
      this.isLoading = true;
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participants:conversation_participants(
            user:profiles(*)
          ),
          last_message:messages(*)
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      runInAction(() => {
        this.conversations.clear();
        data.forEach(conv => {
          this.conversations.set(conv.id, {
            id: conv.id,
            participants: conv.participants.map((p: any) => p.user),
            lastMessage: conv.last_message[0] || null,
            unreadCount: 0,
            createdAt: new Date(conv.created_at),
            updatedAt: new Date(conv.updated_at)
          });
        });
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to load conversations';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async loadMessages(conversationId: string) {
    try {
      this.isLoading = true;
      this.activeConversationId = conversationId;

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      runInAction(() => {
        this.messages.set(conversationId, data.map(msg => ({
          id: msg.id,
          conversationId: msg.conversation_id,
          senderId: msg.sender_id,
          content: msg.content,
          attachment: msg.attachment,
          isRead: msg.is_read,
          createdAt: new Date(msg.created_at),
          updatedAt: new Date(msg.updated_at)
        })));
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to load messages';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async sendMessage(conversationId: string, content: string) {
    try {
      this.isLoading = true;
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: supabase.auth.getUser()?.id,
          content
        })
        .select()
        .single();

      if (error) throw error;

      runInAction(() => {
        const messages = this.messages.get(conversationId) || [];
        this.messages.set(conversationId, [data, ...messages]);

        const conversation = this.conversations.get(conversationId);
        if (conversation) {
          conversation.lastMessage = data;
          conversation.updatedAt = new Date();
        }
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to send message';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  clearError() {
    this.error = null;
  }
}

export const chatStore = new ChatStore();