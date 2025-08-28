import { useRouter } from "next/navigation";

function SidebarItem({
  title,
  description,
  onClick,
  icon,
}: {
  title: string;
  description: string;
  onClick: () => void;
  icon: string;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-gray-50 transition-all group"
    >
      <div className="flex items-center space-x-3">
        <div className="text-gray-400 group-hover:text-red-600 text-xl">
          {icon}
        </div>
        <div>
          <div className="font-medium text-gray-900 group-hover:text-red-600">
            {title}
          </div>
          <div className="text-sm text-gray-500">{description}</div>
        </div>
      </div>
    </button>
  );
}

function Sidebar() {
  const router = useRouter();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">
      <div className="space-y-4">
        <SidebarItem
          title="Vendors"
          description="Manage suppliers"
          onClick={() => router.push("/vendors")}
          icon="🏢"
        />

        <SidebarItem
          title="Customers"
          description="Manage contacts"
          onClick={() => router.push("/customers")}
          icon="👥"
        />

        <SidebarItem
          title="Create Invoice"
          description="Generate new invoice"
          onClick={() => router.push("/invoice/create")}
          icon="📄"
        />

        <SidebarItem
          title="View Invoices"
          description="See all invoices"
          onClick={() => router.push("/invoice/list")}
          icon="📋"
        />

        <SidebarItem
          title="Payments"
          description="Track payments"
          onClick={() => router.push("/payments")}
          icon="💰"
        />

        <SidebarItem
          title="Reports"
          description="View analytics"
          onClick={() => router.push("/reports")}
          icon="📊"
        />
      </div>
    </aside>
  );
}

export default Sidebar;
