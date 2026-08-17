import { NextRequest, NextResponse } from "next/server";

// POST /api/auth/login - Simple login endpoint
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // In production, this would authenticate with Firebase
    // For now, return a mock token
    const token = Buffer.from(email).toString("base64");

    return NextResponse.json(
      {
        token,
        user: {
          email,
          role: "admin",
        },
        message: "Login successful",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
