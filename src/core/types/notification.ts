export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'message';
  userId: string;
  targetId?: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  metadata?: Record<string, any>;
}