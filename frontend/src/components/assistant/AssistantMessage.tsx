import Link from "next/link";

import { Message } from "@/context/AssistantContext";
import { cn } from "@/lib/utils";

interface AssistantMessageProps {
  message: Message;
}

export default function AssistantMessage({ message }: AssistantMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
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
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          {message.content}
        </div>
        {message.route?.path && (
          <Link
            href={{
              pathname: message.route.path,
              query: message.route.params,
            }}
            className="inline-flex items-center px-2 py-1 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded transition-colors"
          >
            {message.route.name} →
          </Link>
        )}
        <div
          className={cn(
            "text-xs text-muted-foreground px-1",
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
