import { NextResponse } from "next/server";
import { mockCompetencyProfileData } from "@/mocks/data/competency-profile";

export async function GET() {
  return NextResponse.json(mockCompetencyProfileData);
}
