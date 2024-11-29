import React from 'react';
import { observer } from 'mobx-react-lite';
import { formatRelativeTime } from '../../../features/shared/utils/date';
import { chatStore } from '../stores/chatStore';
import { useTranslation } from 'react-i18next';

const ChatList: React.FC = () => {
  const { t } = useTranslation();
  const conversations = Array.from(chatStore.conversations.values());

  return (
    <div className="divide-y divide-gray-200">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className="flex items-center space-x-4 p-4 hover:bg-gray-50 cursor-pointer"
          onClick={() => chatStore.loadMessages(conversation.id)}
        >
          <div className="relative">
            <img
              src={conversation.participants[0].avatar || `https://ui-avatars.com/api/?name=${conversation.participants[0].username}`}
              alt={conversation.participants[0].username}
              className="w-12 h-12 rounded-full"
            />
            {conversation.unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {conversation.unreadCount}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {conversation.participants[0].username}
            </p>
            {conversation.lastMessage && (
              <p className="text-sm text-gray-500 truncate">
                {conversation.lastMessage.message}
              </p>
            )}
          </div>
          {conversation.lastMessage && (
            <div className="text-xs text-gray-500">
              {formatRelativeTime(conversation.lastMessage.createdAt)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default observer(ChatList);