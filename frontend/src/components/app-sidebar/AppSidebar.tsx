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
import { Fragment } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import QuickCreate from "./QuickCreate";
import SidebarItem from "./SidebarItem";

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
  return (
    <Sidebar className="sticky border-r border-gray-700" collapsible="icon">
      <SidebarHeader className="items-center">
        <QuickCreate />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        {sidebarGroups.map((group, index) => (
          <Fragment key={group.title}>
            {index > 0 && <SidebarSeparator />}
            <SidebarGroup>
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
          </Fragment>
        ))}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

export default AppSidebar;
