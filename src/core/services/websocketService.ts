import { io, Socket } from 'socket.io-client';
import { rootStore } from '../stores/rootStore';

export class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket() {
    this.socket = io(import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3001', {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.handleReconnect();
    });

    // Message events
    this.socket.on('new_message', (message) => {
      rootStore.messageStore.addMessage(message);
    });

    this.socket.on('message_read', (data) => {
      rootStore.messageStore.markMessageAsRead(data.messageId);
    });

    // Post events
    this.socket.on('new_post', (post) => {
      rootStore.postStore.addPost(post);
    });

    this.socket.on('post_liked', (data) => {
      rootStore.postStore.updatePostLikes(data.postId, data.likes);
    });

    this.socket.on('post_commented', (data) => {
      rootStore.postStore.updatePostComments(data.postId, data.comment);
    });

    // Story events
    this.socket.on('new_story', (story) => {
      rootStore.storyStore.addStory(story);
    });

    this.socket.on('story_viewed', (data) => {
      rootStore.storyStore.markStoryAsViewed(data.storyId);
    });

    // Notification events
    this.socket.on('new_notification', (notification) => {
      rootStore.notificationStore.addNotification(notification);
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  connect(userId?: string) {
    if (!this.socket) return;

    if (userId) {
      this.socket.auth = { userId };
    }

    this.socket.connect();
  }

  disconnect() {
    if (!this.socket) return;
    this.socket.disconnect();
  }

  // Message methods
  sendMessage(conversationId: string, message: any) {
    this.emit('send_message', { conversationId, message });
  }

  markMessageRead(messageId: string) {
    this.emit('mark_message_read', { messageId });
  }

  // Post methods
  likePost(postId: string) {
    this.emit('like_post', { postId });
  }

  commentOnPost(postId: string, comment: string) {
    this.emit('comment_post', { postId, comment });
  }

  // Story methods
  viewStory(storyId: string) {
    this.emit('view_story', { storyId });
  }

  private emit(event: string, data: any) {
    if (!this.socket?.connected) {
      console.warn('Socket not connected. Message queued.');
      return;
    }
    this.socket.emit(event, data);
  }
}

export const websocketService = new WebSocketService();