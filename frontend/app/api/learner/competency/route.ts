import { NextResponse } from "next/server";
import { mockCompetencyProfileData } from "@/mocks/data/competency-profile";

const BACKEND_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/learner/competency`, {
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
  return NextResponse.json(mockCompetencyProfileData);
}
