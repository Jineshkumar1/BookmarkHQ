import { NextRequest, NextResponse } from "next/server"
import { MockXApiClient } from "@/lib/mock-auth"

export async function GET(request: NextRequest) {
  console.log("MOCK API: User info request received")
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const xApiClient = new MockXApiClient()
    const userInfo = await xApiClient.getMe()
    
    console.log("MOCK API: User info response:", userInfo)
    
    return NextResponse.json({
      user: userInfo.data,
      rateLimitInfo: {
        remaining: 900,
        reset: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes from now
        source: 'mock-api'
      }
    })
  } catch (error) {
    console.error("MOCK API: Error fetching user info:", error)
    return NextResponse.json({ error: "Failed to fetch mock user info" }, { status: 500 })
  }
} 