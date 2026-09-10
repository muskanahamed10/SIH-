import { NextRequest, NextResponse } from "next/server";
import { igotAdapter } from "@/lib/adapters/igot-adapter";

export async function GET(
  _request: NextRequest,
  { params }: { params: { resourceId: string } }
) {
  const resource = await igotAdapter.getCourse(params.resourceId);
  if (!resource) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }
  return NextResponse.json(resource);
}
