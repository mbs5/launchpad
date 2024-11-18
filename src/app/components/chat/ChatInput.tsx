"use client";
import { useState } from "react";
import { SendHorizontal, Upload } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="p-4 md:p-6 lg:p-8 border-t border-white/[0.03]">
      <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 rounded-2xl px-4 py-2 bg-white/[0.03] border border-white/[0.05] 
            text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/10 
            transition-all duration-200"
          disabled={isLoading}
        />

        <button
          type="button"
          className="rounded-2xl px-4 py-2 bg-white/[0.03] border border-white/[0.05] 
            text-white/90 hover:bg-white/[0.08] transition-all duration-200"
          disabled={true}
          title="PDF upload coming soon"
        >
          <Upload className="w-5 h-5" />
        </button>

        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="rounded-2xl px-4 py-2 bg-white/[0.05] border border-white/[0.05] 
            text-white/90 disabled:opacity-50 hover:bg-white/[0.08] transition-all duration-200"
        >
          <SendHorizontal className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
} 