export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  attachment?: {
    type: 'image' | 'file' | 'audio';
    url: string;
    name: string;
  };
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    username: string;
    avatar?: string;
  }[];
  lastMessage: Message | null;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}