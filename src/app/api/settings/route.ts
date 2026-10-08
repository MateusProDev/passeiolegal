import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { settingsService } from "@/lib/firestore";
import { PUBLIC_API_CACHE_HEADERS } from "@/lib/api-cache";

// GET /api/settings - Get site settings
export async function GET() {
  try {
    const settings = await settingsService.get();
    return NextResponse.json(settings, {
      headers: PUBLIC_API_CACHE_HEADERS,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Update site settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    await settingsService.update(body);
    revalidatePath("/api/settings");
    revalidatePath("/", "layout");
    return NextResponse.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}

// POST /api/settings - Create/update site settings (alternative method)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await settingsService.update(body);
    revalidatePath("/api/settings");
    revalidatePath("/", "layout");
    return NextResponse.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
