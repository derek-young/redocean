"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuthContext } from "@/context/AuthContext";

import Initializing from "./Initializing";
import Redirecting from "./Redirecting";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({
  children,
  fallback = <Initializing />,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return fallback;
  }

  if (!user) {
    return <Redirecting message="Redirecting to login..." />;
  }

  return children;
}
