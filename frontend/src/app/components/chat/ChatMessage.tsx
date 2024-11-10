type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export default function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`group relative w-full ${isUser ? "bg-transparent" : "bg-gray-800/50"}`}>
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="flex items-start gap-6">
          <div className={`shrink-0 w-7 h-7 rounded-sm flex items-center justify-center ${
            isUser ? "bg-blue-500/20 text-blue-200" : "bg-teal-500/20 text-teal-200"
          }`}>
            {isUser ? "U" : "A"}
          </div>
          
          <div className="flex-1 space-y-2">
            <p className={`text-base leading-7 ${
              isUser ? "text-white/90" : "text-white/90"
            }`}>
              {message.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 