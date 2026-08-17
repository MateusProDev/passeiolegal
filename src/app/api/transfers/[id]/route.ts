import { NextRequest, NextResponse } from "next/server";
import { transferService } from "@/lib/firestore";

// PUT /api/transfers/[id] - Update transfer
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    await transferService.update(params.id, body);
    return NextResponse.json({ message: "Transfer updated successfully" });
  } catch (error) {
    console.error("Error updating transfer:", error);
    return NextResponse.json(
      { error: "Failed to update transfer" },
      { status: 500 }
    );
  }
}

// DELETE /api/transfers/[id] - Delete transfer
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await transferService.delete(params.id);
    return NextResponse.json({ message: "Transfer deleted successfully" });
  } catch (error) {
    console.error("Error deleting transfer:", error);
    return NextResponse.json(
      { error: "Failed to delete transfer" },
      { status: 500 }
    );
  }
}
