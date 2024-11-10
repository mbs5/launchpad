"use client";

import { useState } from "react";
import { SendHorizontal } from "lucide-react";

type ChatInputProps = {
  onSend: (message: string) => void;
  isLoading: boolean;
};

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 rounded-xl px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="rounded-xl px-6 py-3 bg-blue-500/20 border border-blue-500/30 text-blue-200 disabled:opacity-50 hover:bg-blue-500/30 transition-colors"
        >
          <SendHorizontal className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
} 