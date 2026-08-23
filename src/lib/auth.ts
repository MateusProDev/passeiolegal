import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "./firebase-admin";

export const SESSION_COOKIE_NAME = "authToken";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 5;

export interface AuthenticatedUser {
  uid: string;
  email: string | null;
}

function adminEmailAllowlist(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  const allowlist = adminEmailAllowlist();
  if (allowlist.length === 0) return true;
  return !!email && allowlist.includes(email.toLowerCase());
}

function extractToken(request: NextRequest): string | null {
  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length).trim() || null;
  }
  return request.cookies.get(SESSION_COOKIE_NAME)?.value || null;
}

export async function getAuthenticatedUser(
  request: NextRequest
): Promise<AuthenticatedUser | null> {
  if (!adminAuth) return null;

  const token = extractToken(request);
  if (!token) return null;

  try {
    const decoded = await adminAuth
      .verifySessionCookie(token, true)
      .catch(() => adminAuth!.verifyIdToken(token, true));

    if (!isAllowedAdminEmail(decoded.email)) return null;

    return { uid: decoded.uid, email: decoded.email ?? null };
  } catch {
    return null;
  }
}

/**
 * Returns an error response when the request is not an authenticated admin
 * request, or null when the caller may proceed.
 */
export async function requireAuth(
  request: NextRequest
): Promise<NextResponse | null> {
  if (!adminAuth) {
    console.error(
      "Firebase Admin credentials are not configured; refusing privileged request"
    );
    return NextResponse.json(
      { error: "Server authentication is not configured" },
      { status: 503 }
    );
  }

  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
