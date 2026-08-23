import { NextRequest, NextResponse } from "next/server";
import { bannerService } from "@/lib/firestore";
import { requireAuth } from "@/lib/auth";

// GET /api/banners/[id] - Get single banner
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const banner = await bannerService.getById(params.id);
    if (!banner) {
      return NextResponse.json(
        { error: "Banner not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(banner);
  } catch (error) {
    console.error("Error fetching banner:", error);
    return NextResponse.json(
      { error: "Failed to fetch banner" },
      { status: 500 }
    );
  }
}

// PUT /api/banners/[id] - Update banner
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const unauthorized = await requireAuth(request);
    if (unauthorized) return unauthorized;

    const body = await request.json();
    await bannerService.update(params.id, body);
    return NextResponse.json({ message: "Banner updated successfully" });
  } catch (error) {
    console.error("Error updating banner:", error);
    return NextResponse.json(
      { error: "Failed to update banner" },
      { status: 500 }
    );
  }
}

// DELETE /api/banners/[id] - Delete banner
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const unauthorized = await requireAuth(request);
    if (unauthorized) return unauthorized;

    await bannerService.delete(params.id);
    return NextResponse.json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.error("Error deleting banner:", error);
    return NextResponse.json(
      { error: "Failed to delete banner" },
      { status: 500 }
    );
  }
}
