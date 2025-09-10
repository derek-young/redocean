"use client";

import { X, Bot, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import AssistantChat from "./AssistantChat";
import AssistantInput from "./AssistantInput";

interface AssistantPanelProps {
  onClose: () => void;
}

export default function AssistantPanel({ onClose }: AssistantPanelProps) {
  const handleSendMessage = (message: string) => {
    // This would connect to your AI service
    console.log("Sending message:", message);
  };
  return (
    <div
      className={cn(
        "w-full h-full",
        "bg-card border border-border",
        "rounded-lg shadow-xl",
        "flex flex-col",
        "backdrop-blur-sm"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between p-4",
          "border-b border-border",
          "bg-muted/30"
        )}
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bot className="w-5 h-5 text-primary" />
            <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-400" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Ready to help</p>
          </div>
        </div>
        <Button
          onClick={onClose}
          size="icon"
          variant="ghost"
          className="w-8 h-8"
          aria-label="Close Assistant"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex-1 flex flex-col min-h-0">
        <AssistantChat onSendMessage={handleSendMessage} />
        <AssistantInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
