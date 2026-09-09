import { NextRequest, NextResponse } from "next/server";
import { igotAdapter } from "@/lib/adapters/igot-adapter";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const competencyId = searchParams.get("competencyId") || undefined;
  const priority = searchParams.get("priority") || undefined;
  const type = searchParams.get("type") || undefined;
  const sortBy = (searchParams.get("sortBy") as "recommended" | "duration" | "gap") || "recommended";

  const data = await igotAdapter.getLearningResources({
    competencyId,
    priority,
    type,
    sortBy,
  });

  return NextResponse.json(data);
}
