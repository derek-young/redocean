import Link from "next/link";

import Logo from "./Logo";
import SearchBar from "./search/SearchBar";

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="hover:opacity-80 transition-opacity flex-shrink-0"
        >
          <Logo />
        </Link>
        <div className="flex-1">
          <SearchBar />
        </div>
        <div className="flex items-center space-x-4 flex-shrink-0">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              CA
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
