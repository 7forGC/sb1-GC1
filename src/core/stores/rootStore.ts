import { makeAutoObservable } from 'mobx';
import { AuthStore } from '../../features/auth/stores/authStore';
import { ChatStore } from '../../features/chat/stores/chatStore';

export class RootStore {
  authStore: AuthStore;
  chatStore: ChatStore;

  constructor() {
    this.authStore = new AuthStore();
    this.chatStore = new ChatStore();
    makeAutoObservable(this);
  }
}

export const rootStore = new RootStore();