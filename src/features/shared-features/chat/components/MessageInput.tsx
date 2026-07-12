import React from 'react';
import { Send, Loader, Lock } from 'lucide-react';

interface MessageInputProps {
  onSend: (message: string) => Promise<void>;
  isLoading?: boolean;
  isEncrypting?: boolean;
  placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  isLoading = false,
  isEncrypting = false,
  placeholder = 'Type your message...',
}) => {
  const [message, setMessage] = React.useState('');

  const handleSend = async () => {
    if (!message.trim() || isLoading || isEncrypting) return;
    try {
      await onSend(message);
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSend();
    }
  };

  return (
    <div className="flex gap-2 rounded-xl border-2 border-gray-100 bg-gray-50 p-2 focus-within:border-teal-500 transition-colors">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="flex-1 resize-none bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none p-2"
        rows={2}
      />
      <button
        onClick={handleSend}
        disabled={isLoading || isEncrypting || !message.trim()}
        className="flex items-center justify-center rounded-xl bg-teal-600 px-6 py-2 font-semibold text-white hover:bg-teal-700 disabled:opacity-50 transition-colors"
      >
        {isEncrypting ? (
          <span className="flex items-center gap-2 text-sm"><Lock className="h-4 w-4 animate-pulse" /> E2EE</span>
        ) : isLoading ? (
          <Loader className="h-5 w-5 animate-spin" />
        ) : (
          <Send className="h-5 w-5" />
        )}
      </button>
    </div>
  );
};
