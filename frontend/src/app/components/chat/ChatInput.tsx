"use client";

import { useState, useRef } from "react";
import { SendHorizontal, Upload, FileText, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ChatInputProps = {
  onSend: (message: string, file?: File) => void;
  isLoading: boolean;
};

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || selectedFile) && !isLoading) {
      onSend(message, selectedFile || undefined);
      setMessage("");
      setSelectedFile(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 border-t border-white/[0.03]">
      {/* Selected File Display */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-4 p-2 bg-white/[0.03] rounded-lg flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-white/60" />
            <span className="text-sm text-white/80 flex-1">{selectedFile.name}</span>
            <button
              type="button"
              onClick={removeFile}
              className="p-1 hover:bg-white/[0.05] rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-2xl px-6 py-4 bg-white/[0.03] backdrop-blur-sm border border-white/[0.05] 
            text-white/90 hover:bg-white/[0.08] transition-all duration-200 group"
        >
          <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>

        <button
          type="submit"
          disabled={isLoading || (!message.trim() && !selectedFile)}
          className="rounded-2xl px-6 py-4 bg-white/[0.05] backdrop-blur-sm border border-white/[0.05] 
            text-white/90 disabled:opacity-50 hover:bg-white/[0.08] transition-all duration-200 
            disabled:cursor-not-allowed group"
        >
          <SendHorizontal className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </form>
  );
} 