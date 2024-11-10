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
  context?: ChatContext;
  onCopyToSidebar?: (content: string) => void;
};

export default function ChatInterface({ example, previousPRD, initialMessage, onMessagesUpdate, context, onCopyToSidebar }: ChatInterfaceProps) {
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

  const handleSend = async (message: string, file?: File) => {
    setIsLoading(true);

    try {
      if (file) {
        const formData = new FormData();
        formData.append('pdf', file);
        
        // Upload PDF
        const uploadResponse = await fetch('/api/upload-pdf', {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload PDF');
        }
        
        const { text: pdfContent } = await uploadResponse.json();
        
        // Add user message with PDF
        const newMessage: Message = {
          role: "user",
          content: message || "Please analyze the attached resume.",
          timestamp: new Date(),
          attachment: {
            type: "pdf",
            name: file.name,
            content: pdfContent
          }
        };
        
        setMessages(prev => [...prev, newMessage]);
        
        // Send message with PDF content to chat API
        const chatResponse = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workflowName: example.workflowName,
            input: {
              ...example.input,
              message,
              pdfContent,
              previousMessages: messages,
              ...context,
            },
          }),
        });
        
        if (!chatResponse.ok) {
          throw new Error('Failed to get AI response');
        }

        const data = await chatResponse.json();
        
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content: data.content,
            timestamp: new Date(),
          },
        ]);
      } else {
        // Handle regular message without PDF
        const newMessage: Message = {
          role: "user",
          content: message,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, newMessage]);
        
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workflowName: example.workflowName,
            input: {
              ...example.input,
              message,
              previousMessages: messages,
              ...context,
            },
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to get AI response');
        }

        const data = await response.json();
        
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content: data.content,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      // Optionally show error message to user
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[700px] w-full max-w-3xl bg-black/40 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <AnimatePresence initial={false} mode="wait">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChatMessage 
                message={msg} 
                onCopyToSidebar={msg.role === "assistant" ? onCopyToSidebar : undefined}
              />
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 p-4 bg-white/[0.02] rounded-lg"
            >
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" 
                      style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" 
                      style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" 
                      style={{ animationDelay: "300ms" }} />
              </div>
              <span className="text-sm text-white/50">AI is thinking...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
} 