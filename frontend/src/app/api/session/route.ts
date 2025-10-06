import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/firebase/admin";
import { idTokenCache } from "@/lib/tokenCache";

export const POST = async (request: NextRequest) => {
  const cookieStore = await cookies();
  const existingCookie = cookieStore.get("session")?.value;

  if (existingCookie) {
    try {
      const decoded = await auth.verifySessionCookie(existingCookie, true);

      return NextResponse.json({
        status: "success",
        uid: decoded.uid,
        email: decoded.email,
      });
    } catch (e) {
      // Cookie invalid, continue with new session
    }
  }

  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    let decodedToken = idTokenCache.get(token);

    if (!decodedToken) {
      decodedToken = await auth.verifyIdToken(token);
      idTokenCache.set(token, decodedToken);
    }

    const sessionCookie = await auth.createSessionCookie(token, {
      expiresIn: 60 * 60 * 24 * 5 * 1000, // 5 days
    });
    const cookieStore = await cookies();

    cookieStore.set("session", sessionCookie, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    return NextResponse.json({
      status: "success",
      uid: decodedToken.uid,
      email: decodedToken.email,
    });
  } catch (e) {
    console.error("Session creation failed:", e);

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
};
