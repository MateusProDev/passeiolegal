import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/api/crud-route";
import { settingsService } from "@/lib/firestore";

// GET /api/settings - Get site settings
export async function GET() {
  try {
    const settings = await settingsService.get();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return apiError("Failed to fetch settings", 500);
  }
}

async function updateSettings(request: NextRequest) {
  try {
    const body = await request.json();
    await settingsService.update(body);
    return NextResponse.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("Error updating settings:", error);
    return apiError("Failed to update settings", 500);
  }
}

// PUT /api/settings - Update site settings
export const PUT = updateSettings;

// POST /api/settings - Create/update site settings (alternative method)
export const POST = updateSettings;
