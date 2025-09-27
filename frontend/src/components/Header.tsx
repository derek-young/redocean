import Link from "next/link";

import Logo from "./Logo";
import RedOcean from "./RedOcean";
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
          <RedOcean className="text-3xl mb-1" />
        </Link>
      </div>
      <div className="flex-1">
        <SearchBar />
      </div>
      <Logo />
    </header>
  );
}
