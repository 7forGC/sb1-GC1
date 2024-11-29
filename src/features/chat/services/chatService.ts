import { supabase } from '../../../lib/supabase';
import type { Message, Conversation } from '../types';

export class ChatService {
  async getConversations(): Promise<Conversation[]> {
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
    return data;
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async sendMessage(conversationId: string, content: string, attachment?: File): Promise<Message> {
    let attachmentData = null;

    if (attachment) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('chat-attachments')
        .upload(`${conversationId}/${Date.now()}-${attachment.name}`, attachment);

      if (uploadError) throw uploadError;

      attachmentData = {
        type: attachment.type.startsWith('image/') ? 'image' : 'file',
        url: uploadData.path,
        name: attachment.name
      };
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: supabase.auth.getUser()?.id,
        content,
        attachment: attachmentData
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async markAsRead(conversationId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', conversationId)
      .eq('sender_id', supabase.auth.getUser()?.id);

    if (error) throw error;
  }
}

export const chatService = new ChatService();