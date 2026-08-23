import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminAuth } from "@/lib/firebase-admin";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  isAllowedAdminEmail,
} from "@/lib/auth";

const credentialsSchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(1).max(1024),
});

const MAX_ATTEMPTS = 10;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || entry.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + ATTEMPT_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

async function signInWithFirebase(email: string, password: string) {
  const apiKey =
    process.env.FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) return null;

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    }
  );

  if (!response.ok) return null;

  const data = (await response.json()) as { idToken?: string };
  return data.idToken ?? null;
}

// POST /api/auth/login - Authenticate an admin user against Firebase Auth
export async function POST(request: NextRequest) {
  const unauthorized = NextResponse.json(
    { error: "Invalid credentials" },
    { status: 401 }
  );

  try {
    if (!adminAuth) {
      return NextResponse.json(
        { error: "Server authentication is not configured" },
        { status: 503 }
      );
    }

    const parsed = credentialsSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const clientKey =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (rateLimited(clientKey)) {
      return NextResponse.json(
        { error: "Too many login attempts, please try again later" },
        { status: 429 }
      );
    }

    const { email, password } = parsed.data;
    if (!isAllowedAdminEmail(email)) return unauthorized;

    const idToken = await signInWithFirebase(email, password);
    if (!idToken) return unauthorized;

    const decoded = await adminAuth.verifyIdToken(idToken, true);
    if (!isAllowedAdminEmail(decoded.email)) return unauthorized;

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE_SECONDS * 1000,
    });

    const response = NextResponse.json(
      { user: { email: decoded.email ?? email }, message: "Login successful" },
      { status: 200 }
    );

    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
