import { makeAutoObservable } from 'mobx';
import { Notification } from '../types/notification';

export class NotificationStore {
  notifications: Notification[] = [];
  unreadCount = 0;
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  addNotification(notification: Notification) {
    this.notifications.unshift(notification);
    if (!notification.isRead) {
      this.unreadCount++;
    }
  }

  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification && !notification.isRead) {
      notification.isRead = true;
      this.unreadCount = Math.max(0, this.unreadCount - 1);
    }
  }

  markAllAsRead() {
    this.notifications.forEach(notification => {
      notification.isRead = true;
    });
    this.unreadCount = 0;
  }

  clearError() {
    this.error = null;
  }
}

export const notificationStore = new NotificationStore();