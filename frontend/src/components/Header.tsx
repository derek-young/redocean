import Link from "next/link";

import DarkModeToggle from "./DarkModeToggle";
import Logo from "./Logo";
import SearchBar from "./search/SearchBar";

export default function Header() {
  return (
    <header className="bg-background border-b border-border px-6 py-4">
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
          <DarkModeToggle />
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-muted-foreground">
              CA
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
