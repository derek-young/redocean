"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { postSearchNatural } from "@/services/api";

import { useTenantContext } from "./TenantContext";

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
  const { selectedTenantId } = useTenantContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

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
        const response = await postSearchNatural({
          tenantIds: selectedTenantId ? [selectedTenantId] : [],
          searchTerm: message,
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
    [replyAndClose, selectedTenantId]
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
