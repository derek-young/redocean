import { ShipWheel } from "lucide-react";

import { cn } from "@/lib/utils";

function ShipWheelIcon({ className }: { className?: string }) {
  return <ShipWheel className={cn("text-red-500", className)} />;
}

export default ShipWheelIcon;
