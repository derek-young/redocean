"use client";

import { useEffect, useRef } from "react";

import Loading from "@/components/Loading";
import { useAssistantContext } from "@/context/AssistantContext";
import { cn } from "@/lib/utils";

import AssistantMessage from "./AssistantMessage";

interface AssistantChatProps {
  className?: string;
}

export default function AssistantChat({ className }: AssistantChatProps) {
  const { messages, isSubmitting } = useAssistantContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto p-4",
        "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
        "flex flex-col",
        className
      )}
    >
      <div className="flex-1 space-y-4">
        {messages.map((message) => (
          <AssistantMessage key={message.id} message={message} />
        ))}
      </div>
      <div ref={messagesEndRef} />
      {isSubmitting && (
        <div className="flex justify-center items-center py-2">
          <Loading />
        </div>
      )}
    </div>
  );
}
