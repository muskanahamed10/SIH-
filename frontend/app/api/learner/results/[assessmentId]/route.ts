import { NextRequest, NextResponse } from "next/server";
import { mockAssessmentResult } from "@/mocks/data/assessment-results";

export async function GET(
  _request: NextRequest,
  { params }: { params: { assessmentId: string } }
) {
  void params;
  return NextResponse.json(mockAssessmentResult);
}
