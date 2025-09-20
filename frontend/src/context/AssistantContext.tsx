"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  route?: Route;
  timestamp: Date;
}

// TODO: Align the two Route interfaces
interface Route {
  path: string;
  name: string;
  params: Record<string, string>;
}

interface AssistantContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isSubmitting: boolean;
  onSubmitMessage: (message: string) => Promise<void>;
  messages: Message[];
  openAndSubmit: (message: string) => Promise<void>;
}

const AssistantContext = createContext<AssistantContextType | undefined>(
  undefined
);

export function AssistantContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "I have routed ye to create an invoice for Orion Spice Syndicate. The invoice date be set to today, and the due date be set for one month hence.",
      role: "assistant",
      route: {
        path: "/invoice/create",
        name: "Create Invoice",
        params: {
          "customer-select": "Orion Spice Syndicate",
          "invoice-date": "2025-09-20",
          "due-date": "2025-10-20",
        },
      },
      timestamp: new Date(),
    },
  ]);

  console.log("messages", messages);

  const setNewMessage = (
    message: string,
    role: "user" | "assistant",
    route?: Route
  ) => {
    setMessages((prev) => {
      return [
        ...prev,
        {
          id: `${Date.now().toString()}_${role}`,
          content: message,
          role,
          route,
          timestamp: new Date(),
        },
      ];
    });
  };

  const replyAndClose = useCallback((message: string) => {
    setNewMessage(message, "user");

    setTimeout(() => {
      setNewMessage("Aye, aye!", "assistant");
    }, 500);

    setTimeout(() => {
      setIsOpen(false);
    }, 1600);
  }, []);

  const onSubmitMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) return;

      if (message.toLowerCase().includes("thanks")) {
        replyAndClose(message);
        return;
      }

      setNewMessage(message, "user");
      setIsSubmitting(true);

      try {
        const response = await fetch("/api/v1/search/natural", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ searchTerm: message }),
        });

        const data = await response.json();

        console.log("data", data);

        setNewMessage(data.message, "assistant", data.route);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [replyAndClose]
  );

  const openAndSubmit = useCallback(
    async (message: string) => {
      setIsOpen(true);
      onSubmitMessage(message);
    },
    [onSubmitMessage]
  );

  const value = useMemo(
    () => ({
      isOpen,
      setIsOpen,
      isSubmitting,
      onSubmitMessage,
      messages,
      openAndSubmit,
    }),
    [isOpen, setIsOpen, isSubmitting, onSubmitMessage, messages, openAndSubmit]
  );

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  );
}

export function useAssistantContext() {
  const context = useContext(AssistantContext);
  if (context === undefined) {
    throw new Error(
      "useAssistantContext must be used within a AssistantContextProvider"
    );
  }
  return context;
}
