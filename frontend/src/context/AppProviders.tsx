import { ReactNode } from "react";

import { SidebarProvider } from "@/components/ui/sidebar";

import { AssistantContextProvider } from "./AssistantContext";

function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AssistantContextProvider>{children}</AssistantContextProvider>
    </SidebarProvider>
  );
}

export default AppProviders;
