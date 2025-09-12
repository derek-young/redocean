import { X } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { useAssistantContext } from "@/context/AssistantContext";
import { cn } from "@/lib/utils";

import AssistantChat from "./AssistantChat";
import AssistantInput from "./AssistantInput";

export default function AssistantPanel() {
  const { setIsOpen } = useAssistantContext();

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
            <Image
              alt="Captain Assistant Logo"
              className="svg-theme-adaptive"
              height={48}
              width={48}
              src="/capn.svg"
            />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Cap&apos;n</h3>
            <p className="text-xs text-muted-foreground">
              Ready t&apos; lend a hand!
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsOpen(false)}
          size="icon"
          variant="ghost"
          className="w-8 h-8"
          aria-label="Close Assistant"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex-1 flex flex-col min-h-0">
        <AssistantChat />
        <AssistantInput />
      </div>
    </div>
  );
}
