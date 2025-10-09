"use client";

import { useAssistantContext } from "@/context/AssistantContext";
import { cn } from "@/lib/utils";

import AssistantPanel from "./AssistantPanel";
import AssistantToggle from "./AssistantToggle";

export default function Assistant() {
  const { isOpen, setIsOpen } = useAssistantContext();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isOpen ? "w-96 h-[600px]" : "w-12 h-12"
        )}
      >
        {isOpen ? (
          <AssistantPanel />
        ) : (
          <AssistantToggle onClick={() => setIsOpen(true)} />
        )}
      </div>
    </div>
  );
}
