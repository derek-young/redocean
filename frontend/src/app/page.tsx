"use client";

import { redirect } from "next/navigation";

import Initializing from "@/components/Initializing";
import { useAuthContext } from "@/context/AuthContext";

export default function Home() {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return <Initializing />;
  }

  if (user) {
    return redirect("/dashboard");
  }

  return redirect("/login");
}
