import { NextRequest, NextResponse } from "next/server"
import { MockXApiClient } from "@/lib/mock-auth"

export async function GET(request: NextRequest) {
  console.log("MOCK API: Search request received")
  
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")
    const maxResults = parseInt(searchParams.get("maxResults") || "10")
    
    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
    }
    
    console.log("MOCK API: Search params:", { query, maxResults })
    
    const xApiClient = new MockXApiClient()
    const searchResults = await xApiClient.searchTweets(query, { maxResults })
    
    console.log("MOCK API: Search results:", {
      count: searchResults.data?.length || 0,
      query
    })
    
    return NextResponse.json({
      tweets: searchResults.data,
      includes: searchResults.includes,
      meta: searchResults.meta,
      rateLimitInfo: {
        remaining: 180,
        reset: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        source: 'mock-api'
      }
    })
  } catch (error) {
    console.error("MOCK API: Error searching tweets:", error)
    return NextResponse.json({ error: "Failed to search mock tweets" }, { status: 500 })
  }
} 