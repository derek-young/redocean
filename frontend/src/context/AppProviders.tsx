import { ReactNode } from "react";

import { SidebarProvider } from "@/components/ui/sidebar";

import { AssistantContextProvider } from "./AssistantContext";
import { TenantApiProvider } from "./TenantApiContext";
import { TenantContextProvider } from "./TenantContext";

function AppProviders({ children }: { children: ReactNode }) {
  return (
    <TenantContextProvider>
      <TenantApiProvider>
        <SidebarProvider>
          <AssistantContextProvider>{children}</AssistantContextProvider>
        </SidebarProvider>
      </TenantApiProvider>
    </TenantContextProvider>
  );
}

export default AppProviders;
