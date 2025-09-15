import Link from "next/link";

import Logo from "./Logo";
import SearchBar from "./search/SearchBar";
import { SidebarTrigger } from "./ui/sidebar";

export default function Header() {
  return (
    <header className="flex items-center gap-4 bg-background border-b border-border px-6 h-(--header-height)">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Link
          href="/"
          className="hover:opacity-80 transition-opacity flex-shrink-0"
        >
          <div className="font-bold text-3xl font-michroma mb-1 text-red-500">
            RED OCEAN
          </div>
        </Link>
      </div>
      <div className="flex-1">
        <SearchBar />
      </div>
      <Logo />
    </header>
  );
}
