"use client";

import { useState, useRef } from "react";
import { SendHorizontal, Upload } from "lucide-react";

type ChatInputProps = {
  onSend: (message: string) => void;
  onFileUpload?: (file: File) => void;
  isLoading: boolean;
  showUpload?: boolean;
};

export default function ChatInput({ onSend, onFileUpload, isLoading, showUpload = false }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      onFileUpload?.(file);
      setShowUploadMenu(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 border-t border-white/[0.03]">
      <div className="flex gap-4 max-w-4xl mx-auto relative">
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
        
        {showUpload && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUploadMenu(!showUploadMenu)}
              className="rounded-2xl px-8 py-4 bg-white/[0.03] backdrop-blur-sm border border-white/[0.05] 
                text-white/90 hover:bg-white/[0.08] transition-all duration-200"
            >
              <Upload className="w-5 h-5" />
            </button>
            
            {showUploadMenu && (
              <div className="absolute bottom-full mb-2 right-0 w-48 bg-black/90 backdrop-blur-lg border 
                border-white/10 rounded-xl overflow-hidden shadow-xl">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-3 text-sm text-white/80 hover:bg-white/[0.05] transition-colors 
                    text-left flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Upload Resume (PDF)
                </button>
              </div>
            )}
          </div>
        )}

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