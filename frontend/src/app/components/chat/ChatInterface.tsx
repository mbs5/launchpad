"use client";

import { useState, useEffect } from "react";
import { ChatExample, Message } from "@/app/types/chat";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { motion, AnimatePresence } from "framer-motion";
import PDFUpload from "./PDFUpload";

type ChatInterfaceProps = {
  example: ChatExample;
  previousPRD?: string;
  initialMessage?: string;
  onMessagesUpdate?: (messages: Message[]) => void;
  showPDFUpload?: boolean;
};

export default function ChatInterface({ example, previousPRD, initialMessage, onMessagesUpdate, showPDFUpload = false }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(() => {
    return [{
      role: "assistant",
      content: initialMessage || example.input.message as string,
      timestamp: new Date(),
    }];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [pdfFile, setPDFFile] = useState<{ name: string; size: number } | null>(null);

  useEffect(() => {
    setMessages([{
      role: "assistant",
      content: initialMessage || example.input.message as string,
      timestamp: new Date(),
    }]);
  }, [example, initialMessage]);

  useEffect(() => {
    onMessagesUpdate?.(messages);
  }, [messages, onMessagesUpdate]);

  const handleSend = async (message: string) => {
    const newMessage: Message = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowName: example.workflowName,
          input: {
            ...example.input,
            message,
            previousMessages: messages,
          },
        }),
      });

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.content,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePDFUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setPDFFile({ name: file.name, size: file.size });
        handleSend(`Process my resume: ${file.name}`);
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
    }
  };

  return (
    <div className="flex flex-col h-[700px] w-full max-w-3xl bg-black/40 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChatMessage message={msg} />
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white/50 flex items-center space-x-2"
            >
              <div className="flex space-x-1">
                <span className="animate-bounce delay-0 w-2 h-2 bg-white/50 rounded-full" />
                <span className="animate-bounce delay-150 w-2 h-2 bg-white/50 rounded-full" />
                <span className="animate-bounce delay-300 w-2 h-2 bg-white/50 rounded-full" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {showPDFUpload && (
        <div className="px-8 pb-4">
          <PDFUpload
            onUpload={handlePDFUpload}
            onRemove={() => setPDFFile(null)}
            currentFile={pdfFile}
          />
        </div>
      )}
      
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
} 