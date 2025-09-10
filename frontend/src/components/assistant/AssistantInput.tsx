"use client";

import { Send } from "lucide-react";
import { useState, KeyboardEvent } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AssistantInputProps {
  className?: string;
  onSendMessage?: (message: string) => void;
}

export default function AssistantInput({
  className,
  onSendMessage,
}: AssistantInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage?.(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn("p-4 border-t border-border", "bg-muted/30", className)}>
      <div className="flex gap-2">
        <textarea
          aria-label="Assistant Message Input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className={cn(
            "flex-1 min-h-[40px] max-h-32 px-3 py-2",
            "bg-background border border-input rounded-md",
            "text-sm text-foreground placeholder:text-muted-foreground",
            "resize-none",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          )}
          rows={1}
        />
        <Button
          onClick={handleSend}
          size="icon"
          disabled={!message.trim()}
          className="w-10 h-10 flex-shrink-0"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
