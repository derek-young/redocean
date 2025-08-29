import Link from "next/link";
import {
  Business,
  People,
  Description,
  Receipt,
  Payment,
  Analytics,
} from "@mui/icons-material";

function SidebarItem({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      href={href}
      className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-gray-50 transition-all group block"
    >
      <div className="flex items-center space-x-3">
        <div className="text-gray-400 group-hover:text-red-600 transition-colors">
          <Icon className="text-2xl" />
        </div>
        <div>
          <div className="font-medium text-gray-900 group-hover:text-red-600">
            {title}
          </div>
          <div className="text-sm text-gray-500">{description}</div>
        </div>
      </div>
    </Link>
  );
}

function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">
      <div className="space-y-4">
        <SidebarItem
          title="Vendors"
          description="Manage suppliers"
          href="/vendors"
          icon={Business}
        />

        <SidebarItem
          title="Customers"
          description="Manage contacts"
          href="/customers"
          icon={People}
        />

        <SidebarItem
          title="Create Invoice"
          description="Generate new invoice"
          href="/invoice/create"
          icon={Description}
        />

        <SidebarItem
          title="View Invoices"
          description="See all invoices"
          href="/invoice/list"
          icon={Receipt}
        />

        <SidebarItem
          title="Payments"
          description="Track payments"
          href="/payments"
          icon={Payment}
        />

        <SidebarItem
          title="Reports"
          description="View analytics"
          href="/reports"
          icon={Analytics}
        />
      </div>
    </aside>
  );
}

export default Sidebar;
