import { NextResponse } from "next/server";
import { MODULES_STATUS } from "@/lib/constants";

export async function GET() {
  return NextResponse.json({
    version: "0.9.2-beta",
    status: "operational",
    modules: MODULES_STATUS,
    stats: {
      prismaModels: 145,
      apiEndpoints: 309,
      pages: 57,
    },
    updatedAt: new Date().toISOString(),
  });
}
