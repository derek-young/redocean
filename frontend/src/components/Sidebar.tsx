"use client";

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
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  isImplemented = true,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isImplemented?: boolean;
}) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleClick = (e: React.MouseEvent) => {
    if (!isImplemented) {
      e.preventDefault();
      return;
    }
  };

  return (
    <Link
      onClick={handleClick}
      href={href}
      className={`group block relative px-3 py-2 rounded-lg ${
        isActive
          ? "bg-gray-800 border border-gray-600 text-red-300"
          : "text-gray-300 hover:bg-gray-800 hover:text-red-300"
      } ${!isImplemented ? "opacity-60" : ""}`}
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
            {!isImplemented && (
              <span className="ml-2 text-xs text-gray-500">(Coming Soon)</span>
            )}
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
  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 min-h-screen p-4 border-r border-gray-700">
      <div className="space-y-6">
        {/* Dashboard */}
        <SidebarGroup title="Overview">
          <SidebarItem
            title="Dashboard"
            description="Your financial flight deck"
            href="/"
            icon={Dashboard}
          />
        </SidebarGroup>

        {/* Money Management */}
        <SidebarGroup title="Money Flow">
          <SidebarItem
            title="Cash Flow"
            description="Track the money movement"
            href="/cash-flow"
            icon={TrendingUp}
            isImplemented={false}
          />
          <SidebarItem
            title="Banking"
            description="Connect your accounts"
            href="/banking"
            icon={AccountBalance}
            isImplemented={false}
          />
          <SidebarItem
            title="Payments"
            description="Outgoing to suppliers"
            href="/payments"
            icon={Payment}
          />
        </SidebarGroup>

        {/* Revenue */}
        <SidebarGroup title="Revenue">
          <SidebarItem
            title="Invoices"
            description="View all invoices"
            href="/invoice/list"
            icon={Receipt}
          />
          <SidebarItem
            title="Create Invoice"
            description="Send a new bill"
            href="/invoice/create"
            icon={Description}
          />
          <SidebarItem
            title="Customers"
            description="Your client base"
            href="/customers"
            icon={People}
          />
          <SidebarItem
            title="Estimates"
            description="Draft proposals"
            href="/estimates"
            icon={ReceiptLong}
            isImplemented={false}
          />
        </SidebarGroup>

        {/* Expenses */}
        <SidebarGroup title="Expenses">
          <SidebarItem
            title="Vendors"
            description="Your suppliers"
            href="/vendors"
            icon={Business}
          />
          <SidebarItem
            title="Bills"
            description="Track what you owe"
            href="/bills"
            icon={CreditCard}
            isImplemented={false}
          />
          <SidebarItem
            title="Expenses"
            description="Track spending"
            href="/expenses"
            icon={AttachMoney}
            isImplemented={false}
          />
          <SidebarItem
            title="Inventory"
            description="Stock management"
            href="/inventory"
            icon={Inventory}
            isImplemented={false}
          />
        </SidebarGroup>

        {/* Analytics */}
        <SidebarGroup title="Insights">
          <SidebarItem
            title="Reports"
            description="Financial analytics"
            href="/reports"
            icon={Analytics}
          />
          <SidebarItem
            title="Tax Center"
            description="Tax planning & prep"
            href="/tax"
            icon={Assessment}
            isImplemented={false}
          />
          <SidebarItem
            title="Forecasting"
            description="Future predictions"
            href="/forecasting"
            icon={Timeline}
            isImplemented={false}
          />
        </SidebarGroup>

        {/* Operations */}
        <SidebarGroup title="Operations">
          <SidebarItem
            title="Projects"
            description="Track project costs"
            href="/projects"
            icon={LocalShipping}
            isImplemented={false}
          />
          <SidebarItem
            title="Team"
            description="Manage access"
            href="/team"
            icon={AccountCircle}
            isImplemented={false}
          />
          <SidebarItem
            title="Settings"
            description="Configure system"
            href="/settings"
            icon={Settings}
            isImplemented={false}
          />
          <SidebarItem
            title="Security"
            description="Access & permissions"
            href="/security"
            icon={Security}
            isImplemented={false}
          />
        </SidebarGroup>

        {/* Support */}
        <SidebarGroup title="Support">
          <SidebarItem
            title="Help Center"
            description="Get assistance"
            href="/help"
            icon={Help}
            isImplemented={false}
          />
        </SidebarGroup>
      </div>
    </aside>
  );
}

export default Sidebar;
