import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  console.log("MOCK API: Rate limits info request received")
  
  try {
    const { searchParams } = new URL(request.url)
    const simulateError = searchParams.get("simulateError")
    
    // Simulate different rate limit scenarios
    if (simulateError === "rate_limit") {
      return NextResponse.json({ 
        error: "Rate limit exceeded. Please wait 15 minutes before trying again.",
        retryAfter: "15 minutes"
      }, { status: 429 })
    }
    
    if (simulateError === "auth_error") {
      return NextResponse.json({ 
        error: "Authentication expired. Please sign in again." 
      }, { status: 401 })
    }
    
    // Normal rate limit info
    const rateLimits = {
      bookmarks: {
        limit: 1000,
        remaining: 847,
        reset: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        window: "15 minutes"
      },
      user: {
        limit: 1000,
        remaining: 923,
        reset: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        window: "15 minutes"
      },
      search: {
        limit: 180,
        remaining: 156,
        reset: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        window: "15 minutes"
      },
      tweets: {
        limit: 300,
        remaining: 267,
        reset: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        window: "15 minutes"
      }
    }
    
    return NextResponse.json({
      rateLimits,
      source: 'mock-api',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("MOCK API: Error fetching rate limits:", error)
    return NextResponse.json({ error: "Failed to fetch mock rate limits" }, { status: 500 })
  }
} 