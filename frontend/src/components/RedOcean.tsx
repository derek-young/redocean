import { cn } from "@/lib/utils";

function RedOcean({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "font-bold text-4xl font-michroma text-[var(--logo-red)]",
        className
      )}
    >
      RED OCEAN
    </div>
  );
}

export default RedOcean;
