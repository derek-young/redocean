"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import AssistantPanel from "./assistant/AssistantPanel";
import AssistantToggle from "./assistant/AssistantToggle";

export default function Assistant() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAssistant = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isOpen ? "w-96 h-[600px]" : "w-12 h-12"
        )}
      >
        {isOpen ? (
          <AssistantPanel onClose={() => setIsOpen(false)} />
        ) : (
          <AssistantToggle onClick={toggleAssistant} />
        )}
      </div>
    </div>
  );
}
