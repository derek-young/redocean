"use client";

import { Bot, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AssistantToggleProps {
  onClick: () => void;
}

export default function AssistantToggle({ onClick }: AssistantToggleProps) {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className={cn(
        "w-12 h-12 rounded-full shadow-lg dark:shadow-2xl",
        "bg-gray-700 hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600",
        "text-primary-foreground dark:text-primary-foreground",
        "border border-border dark:border-border",
        "transition-all duration-200",
        "hover:scale-105 active:scale-95"
      )}
      aria-label="Open AI Assistant"
    >
      <div className="relative">
        <Bot className="w-5 h-5" />
        <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-400" />
      </div>
    </Button>
  );
}
