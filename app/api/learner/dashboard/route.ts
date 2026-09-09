import { NextResponse } from "next/server";
import { mockLearnerDashboardData } from "@/mocks/data/learner";

export async function GET() {
  return NextResponse.json(mockLearnerDashboardData);
}
