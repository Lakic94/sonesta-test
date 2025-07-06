import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    console.log("🔄 Manual cache invalidation triggered");
    
    // Invalidate the posts cache tag
    revalidateTag("posts");
    
    console.log("✅ Cache successfully invalidated manually");
    
    return NextResponse.json({ 
      success: true,
      message: "Cache invalidated successfully",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("❌ Error invalidating cache:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to invalidate cache" 
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for testing
export async function GET() {
  return NextResponse.json({ 
    message: "Manual cache invalidation endpoint is active",
    usage: "Send POST request to invalidate cache",
    timestamp: new Date().toISOString()
  });
} 