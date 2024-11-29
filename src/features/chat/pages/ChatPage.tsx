import React from 'react';
import { observer } from 'mobx-react-lite';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import { chatStore } from '../stores/chatStore';

const ChatPage: React.FC = () => {
  return (
    <div className="flex h-screen bg-white">
      <div className="w-1/3 border-r">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Messages</h2>
        </div>
        <ChatList />
      </div>
      <div className="flex-1">
        {chatStore.activeConversationId ? (
          <ChatWindow />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default observer(ChatPage);