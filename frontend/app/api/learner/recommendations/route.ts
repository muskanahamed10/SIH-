import { NextRequest, NextResponse } from "next/server";
import { mockRecommendationsData } from "@/mocks/data/recommendations";

const BACKEND_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const queryString = searchParams.toString();

  try {
    const res = await fetch(`${BACKEND_URL}/api/learner/recommendations?${queryString}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (err) {
    console.warn("Backend unavailable, using fallback mock data:", err);
  }

  return NextResponse.json(mockRecommendationsData);
}
