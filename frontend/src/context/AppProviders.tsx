import { ReactNode } from "react";

import { AssistantContextProvider } from "./AssistantContext";

function AppProviders({ children }: { children: ReactNode }) {
  return <AssistantContextProvider>{children}</AssistantContextProvider>;
}

export default AppProviders;
