"use client";

import {
  LayoutDashboard,
  TrendingUp,
  Building2,
  CreditCard,
  Receipt,
  FileText,
  Users,
  ReceiptIcon,
  DollarSign,
  Package,
  BarChart3,
  FileBarChart,
  TrendingDown,
  Truck,
  UserCircle,
  Settings,
  Shield,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface SidebarItemType {
  title: string;
  description: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  isImplemented: boolean;
}

const sidebarGroups = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        description: "Your financial flight deck",
        url: "/",
        icon: LayoutDashboard,
        isImplemented: true,
      },
    ],
  },
  {
    title: "Money Flow",
    items: [
      {
        title: "Cash Flow",
        description: "Track the money movement",
        url: "/cash-flow",
        icon: TrendingUp,
        isImplemented: false,
      },
      {
        title: "Banking",
        description: "Connect your accounts",
        url: "/banking",
        icon: Building2,
        isImplemented: false,
      },
      {
        title: "Payments",
        description: "Outgoing to suppliers",
        url: "/payments",
        icon: CreditCard,
        isImplemented: true,
      },
    ],
  },
  {
    title: "Revenue",
    items: [
      {
        title: "Invoices",
        description: "View all invoices",
        url: "/invoice/list",
        icon: Receipt,
        isImplemented: true,
      },
      {
        title: "Create Invoice",
        description: "Send a new bill",
        url: "/invoice/create",
        icon: FileText,
        isImplemented: true,
      },
      {
        title: "Customers",
        description: "Your client base",
        url: "/customers",
        icon: Users,
        isImplemented: true,
      },
      {
        title: "Estimates",
        description: "Draft proposals",
        url: "/estimates",
        icon: ReceiptIcon,
        isImplemented: false,
      },
    ],
  },
  {
    title: "Expenses",
    items: [
      {
        title: "Vendors",
        description: "Your suppliers",
        url: "/vendors",
        icon: Building2,
        isImplemented: true,
      },
      {
        title: "Bills",
        description: "Track what you owe",
        url: "/bills",
        icon: CreditCard,
        isImplemented: false,
      },
      {
        title: "Expenses",
        description: "Track spending",
        url: "/expenses",
        icon: DollarSign,
        isImplemented: false,
      },
      {
        title: "Inventory",
        description: "Stock management",
        url: "/inventory",
        icon: Package,
        isImplemented: false,
      },
    ],
  },
  {
    title: "Insights",
    items: [
      {
        title: "Reports",
        description: "Financial analytics",
        url: "/reports",
        icon: BarChart3,
        isImplemented: true,
      },
      {
        title: "Tax Center",
        description: "Tax planning & prep",
        url: "/tax",
        icon: FileBarChart,
        isImplemented: false,
      },
      {
        title: "Forecasting",
        description: "Future predictions",
        url: "/forecasting",
        icon: TrendingDown,
        isImplemented: false,
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        title: "Projects",
        description: "Track project costs",
        url: "/projects",
        icon: Truck,
        isImplemented: false,
      },
      {
        title: "Team",
        description: "Manage access",
        url: "/team",
        icon: UserCircle,
        isImplemented: false,
      },
      {
        title: "Settings",
        description: "Configure system",
        url: "/settings",
        icon: Settings,
        isImplemented: false,
      },
      {
        title: "Security",
        description: "Access & permissions",
        url: "/security",
        icon: Shield,
        isImplemented: false,
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        title: "Help Center",
        description: "Get assistance",
        url: "/help",
        icon: HelpCircle,
        isImplemented: false,
      },
    ],
  },
];

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
          "group/sidebar-link transition-colors duration-200",
          isActive(item.url)
            ? "bg-gray-800 border border-gray-600 text-red-300"
            : "text-gray-300 hover:bg-gray-800 hover:text-red-300",
          !item.isImplemented ? "opacity-60" : ""
        )}
      >
        <Link href={item.isImplemented ? item.url : "#"}>
          <div className="flex items-center space-x-3">
            <div
              className={cn(
                "flex-shrink-0 transition-colors duration-200",
                isActive(item.url)
                  ? "text-red-400"
                  : "text-gray-400 group-hover/sidebar-link:text-red-400"
              )}
            >
              <item.icon className="size-5" />
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
              <div className="text-xs text-gray-500 truncate">
                {item.description}
              </div>
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

export function AppSidebar() {
  const { open } = useSidebar();
  return (
    <Sidebar
      className="border-r border-gray-700 top-(--header-height)"
      collapsible="icon"
      style={{ height: "calc(100svh - var(--header-height))" }}
    >
      <SidebarHeader
        className={cn(open ? "items-end" : "items-center")}
      ></SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        {sidebarGroups.map((group) => (
          <SidebarGroup key={group.title} className="mb-6">
            <SidebarGroupLabel className="text-gray-500 uppercase tracking-wider">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarItem key={item.title} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

export default AppSidebar;
