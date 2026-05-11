import React from 'react';
import { Send, Loader } from 'lucide-react';

interface MessageInputProps {
  onSend: (message: string) => Promise<void>;
  isLoading?: boolean;
  placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  isLoading = false,
  placeholder = 'Escribe tu mensaje...',
}) => {
  const [message, setMessage] = React.useState('');

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;
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
    <div className="flex gap-2 rounded-lg border border-outline bg-surface p-2">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="flex-1 resize-none bg-transparent text-on-surface placeholder-on-surface-variant focus:outline-none"
        rows={2}
      />
      <button
        onClick={handleSend}
        disabled={isLoading || !message.trim()}
        className="flex items-center justify-center rounded-lg bg-primary px-4 py-2 font-semibold text-on-primary hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {isLoading ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </button>
    </div>
  );
};
