import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Message, UserProfile } from "@/types/career";
import { Sparkles, RefreshCw, User } from "lucide-react";
import { Button } from "./ui/button";

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  userProfile: UserProfile | null;
  onSendMessage: (content: string) => void;
  onClearChat: () => void;
  onEditProfile: () => void;
}

const suggestedQuestions = [
  "What career paths match my background?",
  "What skills should I develop next?",
  "Recommend certifications for my goals",
  "Create a 6-month action plan",
];

export function ChatInterface({
  messages,
  isLoading,
  userProfile,
  onSendMessage,
  onClearChat,
  onEditProfile,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-semibold text-lg">Career Advisor</h1>
              <p className="text-xs text-muted-foreground">Your AI career guide</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onEditProfile}>
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
            {messages.length > 0 && (
              <Button variant="ghost" size="sm" onClick={onClearChat}>
                <RefreshCw className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Chat area */}
      <main className="flex-1 overflow-auto px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-accent">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-display font-semibold mb-3">
                Ready to help with your career
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Ask me anything about career paths, educational opportunities, skill development, 
                or let me create a personalized action plan for you.
              </p>

              {/* Suggested questions */}
              <div className="grid sm:grid-cols-2 gap-3 max-w-xl mx-auto">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => onSendMessage(question)}
                    className="p-4 bg-card rounded-xl text-left text-sm hover:shadow-soft transition-all border border-border hover:border-primary/30"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 p-4 rounded-xl bg-card shadow-soft"
                >
                  <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary-foreground animate-pulse-soft" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </motion.div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input area */}
      <div className="sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-4 pb-6 px-6">
        <div className="max-w-4xl mx-auto">
          <ChatInput
            onSend={onSendMessage}
            isLoading={isLoading}
            placeholder="Ask about career paths, education, skills, or get an action plan..."
          />
        </div>
      </div>
    </div>
  );
}
