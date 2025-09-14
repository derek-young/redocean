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
} from "@/components/ui/sidebar";

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

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (url: string) => {
    return url === "/" ? pathname === "/" : pathname.startsWith(url);
  };

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        {sidebarGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url)}
                      className={`${!item.isImplemented ? "opacity-60" : ""}`}
                    >
                      <Link href={item.isImplemented ? item.url : "#"}>
                        <item.icon />
                        <div className="flex flex-col items-start">
                          <span className="flex items-center gap-2">
                            {item.title}
                            {!item.isImplemented && (
                              <span className="text-xs text-muted-foreground">
                                (Coming Soon)
                              </span>
                            )}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {item.description}
                          </span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
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
