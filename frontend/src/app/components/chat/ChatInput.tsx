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
    <form onSubmit={handleSubmit} className="p-8 border-t border-white/[0.03]">
      <div className="flex gap-4 max-w-4xl mx-auto">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 rounded-2xl px-6 py-4 bg-white/[0.03] backdrop-blur-sm border border-white/[0.05] 
            text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/10 
            transition-all duration-200 font-light"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="rounded-2xl px-8 py-4 bg-white/[0.05] backdrop-blur-sm border border-white/[0.05] 
            text-white/90 disabled:opacity-50 hover:bg-white/[0.08] transition-all duration-200 
            disabled:cursor-not-allowed"
        >
          <SendHorizontal className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
} 