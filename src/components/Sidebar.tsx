"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Business,
  People,
  Description,
  Receipt,
  Payment,
  Analytics,
  Dashboard,
  AccountBalance,
  TrendingUp,
  Assessment,
  Settings,
  ReceiptLong,
  CreditCard,
  AccountCircle,
  Inventory,
  LocalShipping,
  AttachMoney,
  Timeline,
  Security,
  Help,
} from "@mui/icons-material";

function SidebarGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-3">
        {title}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function SidebarItem({
  title,
  description,
  href,
  icon: Icon,
  isActive = false,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group block relative px-3 py-2 rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-gray-800 border border-gray-600 text-red-300"
          : "text-gray-300 hover:bg-gray-800 hover:text-red-300"
      }`}
    >
      <div className="flex items-center space-x-3">
        <div
          className={`flex-shrink-0 transition-colors duration-200 ${
            isActive ? "text-red-400" : "text-gray-400 group-hover:text-red-400"
          }`}
        >
          <Icon className="text-xl" />
        </div>
        <div className="flex-1 min-w-0">
          <div
            className={`font-medium text-sm truncate transition-colors duration-200 ${
              isActive
                ? "text-red-300"
                : "text-gray-300 group-hover:text-red-300"
            }`}
          >
            {title}
          </div>
          <div className="text-xs text-gray-500 truncate">{description}</div>
        </div>
      </div>
      {isActive && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-red-500 rounded-r-full" />
      )}
    </Link>
  );
}

function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 min-h-screen p-4 border-r border-gray-700">
      <div className="space-y-6">
        {/* Dashboard */}
        <SidebarGroup title="Overview">
          <SidebarItem
            title="Dashboard"
            description="Your financial cockpit"
            href="/"
            icon={Dashboard}
            isActive={isActive("/")}
          />
        </SidebarGroup>

        {/* Money Management */}
        <SidebarGroup title="Money Flow">
          <SidebarItem
            title="Cash Flow"
            description="Track the money movement"
            href="/cash-flow"
            icon={TrendingUp}
            isActive={isActive("/cash-flow")}
          />
          <SidebarItem
            title="Banking"
            description="Connect your accounts"
            href="/banking"
            icon={AccountBalance}
            isActive={isActive("/banking")}
          />
          <SidebarItem
            title="Payments"
            description="Incoming & outgoing"
            href="/payments"
            icon={Payment}
            isActive={isActive("/payments")}
          />
        </SidebarGroup>

        {/* Revenue */}
        <SidebarGroup title="Revenue">
          <SidebarItem
            title="Invoices"
            description="View all invoices"
            href="/invoice/list"
            icon={Receipt}
            isActive={isActive("/invoice/list")}
          />
          <SidebarItem
            title="Create Invoice"
            description="Send a new bill"
            href="/invoice/create"
            icon={Description}
            isActive={isActive("/invoice/create")}
          />
          <SidebarItem
            title="Customers"
            description="Your client base"
            href="/customers"
            icon={People}
            isActive={isActive("/customers")}
          />
          <SidebarItem
            title="Estimates"
            description="Draft proposals"
            href="/estimates"
            icon={ReceiptLong}
            isActive={isActive("/estimates")}
          />
        </SidebarGroup>

        {/* Expenses */}
        <SidebarGroup title="Expenses">
          <SidebarItem
            title="Vendors"
            description="Your suppliers"
            href="/vendors"
            icon={Business}
            isActive={isActive("/vendors")}
          />
          <SidebarItem
            title="Bills"
            description="Track what you owe"
            href="/bills"
            icon={CreditCard}
            isActive={isActive("/bills")}
          />
          <SidebarItem
            title="Expenses"
            description="Track spending"
            href="/expenses"
            icon={AttachMoney}
            isActive={isActive("/expenses")}
          />
          <SidebarItem
            title="Inventory"
            description="Stock management"
            href="/inventory"
            icon={Inventory}
            isActive={isActive("/inventory")}
          />
        </SidebarGroup>

        {/* Analytics */}
        <SidebarGroup title="Insights">
          <SidebarItem
            title="Reports"
            description="Financial analytics"
            href="/reports"
            icon={Analytics}
            isActive={isActive("/reports")}
          />
          <SidebarItem
            title="Tax Center"
            description="Tax planning & prep"
            href="/tax"
            icon={Assessment}
            isActive={isActive("/tax")}
          />
          <SidebarItem
            title="Forecasting"
            description="Future predictions"
            href="/forecasting"
            icon={Timeline}
            isActive={isActive("/forecasting")}
          />
        </SidebarGroup>

        {/* Operations */}
        <SidebarGroup title="Operations">
          <SidebarItem
            title="Projects"
            description="Track project costs"
            href="/projects"
            icon={LocalShipping}
            isActive={isActive("/projects")}
          />
          <SidebarItem
            title="Team"
            description="Manage access"
            href="/team"
            icon={AccountCircle}
            isActive={isActive("/team")}
          />
          <SidebarItem
            title="Settings"
            description="Configure system"
            href="/settings"
            icon={Settings}
            isActive={isActive("/settings")}
          />
          <SidebarItem
            title="Security"
            description="Access & permissions"
            href="/security"
            icon={Security}
            isActive={isActive("/security")}
          />
        </SidebarGroup>

        {/* Support */}
        <SidebarGroup title="Support">
          <SidebarItem
            title="Help Center"
            description="Get assistance"
            href="/help"
            icon={Help}
            isActive={isActive("/help")}
          />
        </SidebarGroup>
      </div>
    </aside>
  );
}

export default Sidebar;
