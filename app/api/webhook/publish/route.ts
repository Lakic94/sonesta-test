import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST() {
  console.log("Webhook received");
  revalidateTag("posts");
  return NextResponse.json({ message: "Webhook received and revalidated" });
}
