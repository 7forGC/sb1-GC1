export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  attachments?: {
    type: 'image' | 'video' | 'file';
    url: string;
    name?: string;
  }[];
}