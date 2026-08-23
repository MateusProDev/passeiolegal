import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { initializeFirebaseCollections, checkFirebaseInitialization } from "@/lib/firebase-init";
import { requireAuth } from "@/lib/auth";

function secretMatches(provided: unknown): boolean {
  const expected = process.env.INIT_SECRET;
  if (!expected || typeof provided !== "string") return false;

  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(provided);
  if (expectedBuffer.length !== providedBuffer.length) return false;

  return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
}

// POST /api/init - Initialize Firebase collections
export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json();

    if (!secretMatches(secret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const success = await initializeFirebaseCollections();

    if (success) {
      return NextResponse.json(
        { message: "Firebase collections initialized successfully" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "Failed to initialize Firebase collections" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error in init API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/init - Check initialization status (admin only)
export async function GET(request: NextRequest) {
  try {
    const unauthorized = await requireAuth(request);
    if (unauthorized) return unauthorized;

    const status = await checkFirebaseInitialization();
    return NextResponse.json(status, { status: 200 });
  } catch (error) {
    console.error("Error checking initialization status:", error);
    return NextResponse.json(
      { error: "Failed to check initialization status" },
      { status: 500 }
    );
  }
}
