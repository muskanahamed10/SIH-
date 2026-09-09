import { NextResponse } from "next/server";
import { mockPersonalizedLearningPath } from "@/mocks/data/learning-path";

export async function GET() {
  return NextResponse.json(mockPersonalizedLearningPath);
}
