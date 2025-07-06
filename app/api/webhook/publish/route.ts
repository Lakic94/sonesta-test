export const maxDuration = 60;

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("Webhook received");
  return NextResponse.json({ message: "Webhook received" });
}
