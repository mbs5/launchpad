"use client";
import { useState, useEffect } from "react";
import { ChatContext, ChatExample, Message } from "@/app/types/chat";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { motion, AnimatePresence } from "framer-motion";
import ContextIndicator from "./ContextIndicator";

type ChatInterfaceProps = {
  example: ChatExample;
  previousPRD?: string;
  initialMessage?: string;
  onMessagesUpdate?: (messages: Message[]) => void;
  context?: ChatContext;
  onCopyToSidebar?: (content: string) => void;
};

export default function ChatInterface({ example, previousPRD, initialMessage, onMessagesUpdate, context, onCopyToSidebar }: ChatInterfaceProps) {
  const MESSAGE_HISTORY_LIMIT = 50;
  
  const [messages, setMessages] = useState<Message[]>(() => {
    return [{
      role: "assistant",
      content: initialMessage || example.input.message as string,
      timestamp: new Date(),
    }];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showContext, setShowContext] = useState(true);

  useEffect(() => {
    setMessages([{
      role: "assistant",
      content: initialMessage || example.input.message as string,
      timestamp: new Date(),
    }]);
  }, [example, initialMessage]);

  useEffect(() => {
    if (messages.length > 0) {
      onMessagesUpdate?.(messages);
    }
  }, [messages]);

  const handleSend = async (message: string) => {
    setIsLoading(true);

    try {
      const messageHistory = messages.slice(-MESSAGE_HISTORY_LIMIT);
      
      const newMessage: Message = {
        role: "user",
        content: message,
        timestamp: new Date(),
      };
      
      const requestBody = {
        message,
        input: {
          previousMessages: messageHistory,
          context: context?.refinedPRD || '',
          stage: example.input.stage,
          preferences: context?.preferences || null
        },
      };

      console.log('ChatInterface - Request:', {
        stage: example.input.stage,
        context: context?.refinedPRD || 'No context available',
        preferences: context?.preferences || 'No preferences set',
        message
      });
      
      setMessages(prev => {
        const updated = [...prev, newMessage];
        return updated.slice(-MESSAGE_HISTORY_LIMIT);
      });

      const maxRetries = 3;
      let retryCount = 0;
      let response;

      while (retryCount < maxRetries) {
        try {
          response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          });
          break;
        } catch (error) {
          retryCount++;
          if (retryCount === maxRetries) throw error;
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      console.log('ChatInterface - Response:', data);
      
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: data.content,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
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

  const ContextDisplay = () => {
    if (!context?.context || !context?.refinedPRD) return null;
    
    return (
      <div className="mb-8 p-6 bg-white/[0.02] rounded-xl border border-white/[0.05]">
        <div className="space-y-4">
          {context.refinedPRD && (
            <div>
              <h3 className="text-lg font-medium text-white/70 mb-2">Project Overview</h3>
              <p className="text-white/60 text-sm">{context.refinedPRD}</p>
            </div>
          )}
          {context?.preferences && (
            <div>
              <h3 className="text-lg font-medium text-white/70 mb-2">Project Preferences</h3>
              <ul className="text-white/60 text-sm space-y-1">
                <li>• Complexity: {context.preferences.complexity}</li>
                <li>• Timeline: {context.preferences.timeline}</li>
                <li>• Priority: {context.preferences.priority}</li>
                <li>• Deployment: {context.preferences.deployment}</li>
                <li>• Team Size: {context.preferences.team}</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[700px] w-full max-w-3xl bg-black/40 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <AnimatePresence mode="sync">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {idx === 0 && <ContextDisplay />}
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
      
      {example.input.stage !== 'initial' && context && showContext && (
        <ContextIndicator 
          context={context}
          onClear={() => setShowContext(false)}
        />
      )}
      
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
} 