import {
  Building2,
  CreditCard,
  DollarSign,
  FileText,
  PlusIcon,
  Users,
  ReceiptIcon,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const createOptions = [
  {
    title: "Invoice",
    description: "Create a new invoice",
    url: "/invoice/create",
    icon: FileText,
    isImplemented: true,
  },
  {
    title: "Customer",
    description: "Add a new customer",
    url: "/customers/create",
    icon: Users,
    isImplemented: true,
  },
  {
    title: "Vendor",
    description: "Add a new vendor",
    url: "/vendors/create",
    icon: Building2,
    isImplemented: true,
  },
  {
    title: "Estimate",
    description: "Create an estimate",
    url: "/estimates/create",
    icon: ReceiptIcon,
    isImplemented: false,
  },
  {
    title: "Bill",
    description: "Record a new bill",
    url: "/bills/create",
    icon: CreditCard,
    isImplemented: false,
  },
  {
    title: "Expense",
    description: "Track an expense",
    url: "/expenses/create",
    icon: DollarSign,
    isImplemented: false,
  },
];

function QuickCreate() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-fit bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-gray-500 hover:text-red-300 transition-all duration-200"
        >
          <PlusIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-2 bg-gray-800 border-gray-600"
        side="right"
        align="start"
      >
        <div className="space-y-1">
          {createOptions.map((option) => (
            <Link
              key={option.title}
              href={option.isImplemented ? option.url : "#"}
              className={cn(
                "flex items-center space-x-3 p-2 rounded-md transition-colors duration-200",
                "hover:bg-gray-700 text-gray-300 hover:text-red-300",
                !option.isImplemented
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer"
              )}
            >
              <div className="flex-shrink-0 text-gray-400">
                <option.icon className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">
                  {option.title}
                  {!option.isImplemented && (
                    <span className="ml-2 text-xs text-gray-500">
                      (Coming Soon)
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {option.description}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default QuickCreate;
