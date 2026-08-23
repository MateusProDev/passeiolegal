import { NextRequest, NextResponse } from "next/server";
import { blogService } from "@/lib/firestore";
import { requireAuth } from "@/lib/auth";

// PUT /api/blog/[id] - Update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const unauthorized = await requireAuth(request);
    if (unauthorized) return unauthorized;

    const body = await request.json();
    await blogService.update(params.id, body);
    return NextResponse.json({ message: "Blog post updated successfully" });
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/[id] - Delete blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const unauthorized = await requireAuth(request);
    if (unauthorized) return unauthorized;

    await blogService.delete(params.id);
    return NextResponse.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
