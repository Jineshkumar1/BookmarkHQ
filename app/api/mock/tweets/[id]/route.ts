import { NextRequest, NextResponse } from "next/server"
import { MockXApiClient } from "@/lib/mock-auth"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log("MOCK API: Tweet lookup request received for ID:", params.id)
  
  try {
    const xApiClient = new MockXApiClient()
    const tweetData = await xApiClient.getTweet(params.id)
    
    console.log("MOCK API: Tweet data retrieved:", {
      id: params.id,
      hasData: !!tweetData.data,
      hasIncludes: !!tweetData.includes
    })
    
    return NextResponse.json({
      tweet: tweetData.data,
      includes: tweetData.includes,
      rateLimitInfo: {
        remaining: 300,
        reset: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        source: 'mock-api'
      }
    })
  } catch (error) {
    console.error("MOCK API: Error fetching tweet:", error)
    
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json({ error: "Tweet not found" }, { status: 404 })
    }
    
    return NextResponse.json({ error: "Failed to fetch mock tweet" }, { status: 500 })
  }
} 