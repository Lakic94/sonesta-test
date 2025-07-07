import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

interface ContentfulWebhookPayload {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    revision: number;
    contentType: {
      sys: {
        id: string;
      };
    };
  };
  fields?: {
    [key: string]: any;
  };
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔔 Contentful webhook received");
    
    // Get the webhook payload
    const payload: ContentfulWebhookPayload = await request.json();
    
    // Log webhook details
    console.log("📝 Webhook Details:");
    console.log("- Entry ID:", payload.sys.id);
    console.log("- Content Type:", payload.sys.contentType.sys.id);
    console.log("- Revision:", payload.sys.revision);
    console.log("- Updated At:", payload.sys.updatedAt);
    console.log("- Webhook Type:", payload.sys.type);
    console.log("- Payload:", payload);
    
    // Optional: Verify webhook signature (uncomment if you set up webhook signatures)
    // const signature = request.headers.get('x-contentful-signature');
    // if (!verifyContentfulSignature(signature, payload)) {
    //   console.error("❌ Invalid webhook signature");
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    // }
    
    // Check if this is a publish event
    if (payload.sys.type === "Entry") {
      console.log("🚀 Invalidating cache for tag: posts");
      revalidateTag("posts");
      
      console.log("✅ Cache successfully invalidated");
      
      return NextResponse.json({ 
        message: "Webhook received and cache invalidated",
        entry: {
          id: payload.sys.id,
          revision: payload.sys.revision,
          updatedAt: payload.sys.updatedAt
        },
        timestamp: new Date().toISOString()
      });
    } else {
      console.log("ℹ️ Webhook received but not an Entry publish event");
      return NextResponse.json({ 
        message: "Webhook received but no action taken",
        type: payload.sys.type,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Optional: Handle GET requests for webhook verification
export async function GET() {
  return NextResponse.json({ 
    message: "Contentful webhook endpoint is active",
    timestamp: new Date().toISOString()
  });
}

// Optional: Verify Contentful webhook signature
// function verifyContentfulSignature(signature: string | null, payload: any): boolean {
//   if (!signature || !process.env.WEBHOOK_SECRET) {
//     return false;
//   }
//   
//   const crypto = require('crypto');
//   const hash = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET)
//     .update(JSON.stringify(payload))
//     .digest('hex');
//   
//   return signature === hash;
// }
