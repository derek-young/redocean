import Link from "next/link";
import { usePathname } from "next/navigation";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface SidebarItemType {
  title: string;
  description: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  isImplemented: boolean;
}

function SidebarItem({ item }: { item: SidebarItemType }) {
  const pathname = usePathname();
  const isActive = (url: string) => {
    return url === "/" ? pathname === "/" : pathname.startsWith(url);
  };

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton
        asChild
        className={cn(
          "h-fit",
          "group/sidebar-link",
          isActive(item.url)
            ? "bg-gray-800 border border-gray-600 text-red-300"
            : "text-gray-300 border border-transparent hover:bg-gray-800 hover:text-red-300",
          !item.isImplemented ? "opacity-60" : ""
        )}
      >
        <Link href={item.isImplemented ? item.url : "#"}>
          <div
            className={cn(
              "flex-shrink-0 transition-colors duration-200",
              isActive(item.url)
                ? "text-red-400"
                : "text-gray-400 group-hover/sidebar-link:text-red-400"
            )}
          >
            <item.icon className="size-4" />
          </div>
          <div>
            <div
              className={cn(
                "font-medium truncate transition-colors duration-200",
                isActive(item.url)
                  ? "text-red-300"
                  : "text-gray-300 group-hover/sidebar-link:text-red-300"
              )}
            >
              {item.title}
              {!item.isImplemented && (
                <span className="ml-2 text-xs text-gray-500">
                  (Coming Soon)
                </span>
              )}
            </div>
          </div>
          {isActive(item.url) && (
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-red-500 rounded-r-full" />
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export default SidebarItem;
