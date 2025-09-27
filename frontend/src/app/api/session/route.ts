import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/firebaseAdmin";

export const POST = async (request: NextRequest) => {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const decodedToken = await auth.verifyIdToken(token);
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await auth.createSessionCookie(token, {
      expiresIn,
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
