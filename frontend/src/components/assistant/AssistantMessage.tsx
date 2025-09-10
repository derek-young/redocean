"use client";

import { Bot, User } from "lucide-react";

import { cn } from "@/lib/utils";

import { Message } from "./AssistantChat";

interface AssistantMessageProps {
  message: Message;
}

export default function AssistantMessage({ message }: AssistantMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser
            ? "bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground"
            : "bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground"
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "flex flex-col gap-1 max-w-[80%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "px-3 py-2 rounded-lg text-sm",
            "break-words",
            isUser
              ? "bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground"
              : "bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground"
          )}
        >
          {message.content}
        </div>
        <div
          className={cn(
            "text-xs text-muted-foreground dark:text-muted-foreground",
            isUser ? "text-right" : "text-left"
          )}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
