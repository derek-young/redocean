import ShipWheelIcon from "@/components/ShipWheelIcon";
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
        "w-12 h-12 rounded-full shadow-lg",
        "bg-muted hover:bg-muted/90",
        "text-foreground",
        "border-2 border-border shadow-xl",
        "transition-all duration-200",
        "hover:scale-105 active:scale-95",
        "hover:shadow-2xl"
      )}
      aria-label="Open AI Assistant"
    >
      <div className="transition-transform duration-1000 hover:rotate-360">
        <ShipWheelIcon className="size-5" />
      </div>
    </Button>
  );
}
