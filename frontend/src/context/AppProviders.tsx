import { ReactNode } from "react";

import { SidebarProvider } from "@/components/ui/sidebar";

import { AssistantContextProvider } from "./AssistantContext";
import { AuthProvider } from "./AuthContext";
import { TenantApiProvider } from "./TenantApiContext";
import { TenantContextProvider } from "./TenantContext";

function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <TenantContextProvider>
        <TenantApiProvider>
          <SidebarProvider>
            <AssistantContextProvider>{children}</AssistantContextProvider>
          </SidebarProvider>
        </TenantApiProvider>
      </TenantContextProvider>
    </AuthProvider>
  );
}

export default AppProviders;
