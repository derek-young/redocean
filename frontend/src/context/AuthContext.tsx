"use client";

import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

import { setHandler } from "@/fetch";
import { auth } from "@/firebase/client";
import { postSession } from "@/services/api";

async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

async function signOut() {
  try {
    await fetch("/api/logout", { method: "POST" });
  } catch (error) {
    console.error("Backend logout error:", error);
  }

  return firebaseSignOut(auth);
}

setHandler(signOut);

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          setIsLoading(true);
          const idToken = await firebaseUser.getIdToken();
          await postSession(idToken);
          setUser(firebaseUser);
        } catch (error) {
          console.error("Session creation failed:", error);
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
