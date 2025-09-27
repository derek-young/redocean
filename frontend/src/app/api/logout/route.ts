import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/firebaseAdmin";

export const POST = async (request: NextRequest) => {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (sessionCookie) {
      try {
        const decoded = await auth.verifySessionCookie(sessionCookie, true);

        await auth.revokeRefreshTokens(decoded.uid);
      } catch (verifyError) {
        console.log("Session verification failed during logout:", verifyError);
      }
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    cookieStore.delete("session");
    return NextResponse.json({ message: "Logged out" });
  }
};
