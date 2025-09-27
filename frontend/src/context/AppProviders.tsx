import { ReactNode } from "react";

import { SidebarProvider } from "@/components/ui/sidebar";

import { AssistantContextProvider } from "./AssistantContext";
import { AuthProvider } from "./AuthContext";

function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AssistantContextProvider>{children}</AssistantContextProvider>
      </SidebarProvider>
    </AuthProvider>
  );
}

export default AppProviders;
