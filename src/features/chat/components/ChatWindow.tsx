import React, { useState, useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Send, Paperclip, Image, Mic } from 'lucide-react';
import { chatStore } from '../stores/chatStore';
import { formatRelativeTime } from '../../../features/shared/utils/date';
import { useTranslation } from 'react-i18next';

const ChatWindow: React.FC = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatStore.messages]);

  const handleSend = async () => {
    if (!message.trim() || !chatStore.activeConversationId) return;
    
    await chatStore.sendMessage(chatStore.activeConversationId, message);
    setMessage('');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && chatStore.activeConversationId) {
      await chatStore.sendMessage(chatStore.activeConversationId, '', file);
    }
  };

  const messages = chatStore.activeConversationId 
    ? chatStore.messages.get(chatStore.activeConversationId) || []
    : [];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === 'currentUser' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                msg.senderId === 'currentUser'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{msg.message}</p>
              {msg.attachment && (
                <div className="mt-2">
                  {msg.attachment.type === 'image' ? (
                    <img
                      src={msg.attachment.url}
                      alt="attachment"
                      className="rounded-lg max-w-full"
                    />
                  ) : (
                    <a
                      href={msg.attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline"
                    >
                      {msg.attachment.name}
                    </a>
                  )}
                </div>
              )}
              <p className="text-xs mt-1 opacity-70">
                {formatRelativeTime(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Paperclip className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Image className="w-5 h-5 text-gray-500" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('chat.typemessage')}
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {message.trim() ? (
            <button
              onClick={handleSend}
              className="p-2 bg-purple-600 hover:bg-purple-700 rounded-full text-white"
            >
              <Send className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`p-2 rounded-full ${
                isRecording ? 'bg-red-500 text-white' : 'hover:bg-gray-100'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
        />
      </div>
    </div>
  );
};

export default observer(ChatWindow);