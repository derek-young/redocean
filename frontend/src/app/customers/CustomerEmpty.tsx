import { People } from "@mui/icons-material";
import Link from "next/link";

function EmptyState({
  searchTerm,
  statusFilter,
}: {
  searchTerm: string;
  statusFilter: string;
}) {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 mb-4">
        <People className="text-6xl" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        No customers found
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {searchTerm || statusFilter !== "all"
          ? "Try adjusting your search or filter criteria."
          : "Get started by adding your first customer."}
      </p>
      {!searchTerm && statusFilter === "all" && (
        <Link
          href="/customers/create"
          className="px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-100 rounded-md hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors"
        >
          + Add First Customer
        </Link>
      )}
    </div>
  );
}

export default EmptyState;
