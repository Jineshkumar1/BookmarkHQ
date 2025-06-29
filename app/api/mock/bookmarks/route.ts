import { NextRequest, NextResponse } from "next/server"
import { MockXApiClient, mockBookmarks } from "@/lib/mock-auth"
import { processBookmarkData } from "@/lib/x-api"

export async function GET(request: NextRequest) {
  console.log("MOCK API: Bookmarks request received")
  
  try {
    const { searchParams } = new URL(request.url)
    const maxResults = parseInt(searchParams.get("maxResults") || "10")
    const forceRefresh = searchParams.get("forceRefresh") === "true"
    
    console.log("MOCK API: Request params:", { maxResults, forceRefresh })

    // Use mock API client
    const xApiClient = new MockXApiClient()
    const userInfo = await xApiClient.getMe()
    const userId = userInfo.data.id
    console.log("MOCK API: User ID:", userId)

    // Simulate cache behavior
    if (!forceRefresh) {
      console.log("MOCK API: Serving bookmarks from mock cache")
      return NextResponse.json({
        bookmarks: mockBookmarks.slice(0, maxResults),
        meta: { result_count: Math.min(mockBookmarks.length, maxResults) },
        user: userInfo.data,
        rateLimitInfo: { source: 'mock-cache' },
        cached: true,
        last_synced_at: new Date().toISOString(),
      })
    }

    // Simulate fresh fetch
    console.log("MOCK API: Fetching fresh bookmarks from mock API")
    const bookmarksResponse = await xApiClient.getBookmarks(userId, {
      maxResults: maxResults,
      expansions: ["author_id", "attachments.media_keys", "referenced_tweets.id"],
      tweetFields: [
        "id",
        "text",
        "created_at",
        "public_metrics",
        "context_annotations",
        "entities",
        "attachments",
      ],
      userFields: ["id", "name", "username", "profile_image_url", "verified"],
      mediaFields: ["url", "preview_image_url", "type", "width", "height", "alt_text"],
    })
    
    console.log("MOCK API: Bookmarks response received:", {
      tweetCount: bookmarksResponse.data?.length || 0,
      hasIncludes: !!bookmarksResponse.includes,
      includesKeys: bookmarksResponse.includes ? Object.keys(bookmarksResponse.includes) : []
    })

    // Process the bookmark data
    const processedBookmarks = processBookmarkData(bookmarksResponse)
    console.log("MOCK API: Processed bookmarks:", processedBookmarks.length)

    return NextResponse.json({
      bookmarks: processedBookmarks,
      meta: bookmarksResponse.meta,
      user: userInfo.data,
      rateLimitInfo: {
        remaining: bookmarksResponse.meta?.result_count || 0,
        maxResults: maxResults,
        source: 'mock-api',
      },
      cached: false,
      last_synced_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error("MOCK API: Error fetching bookmarks:", error)
    return NextResponse.json({ error: "Failed to fetch mock bookmarks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tweetId } = body

    if (!tweetId) {
      return NextResponse.json({ error: "Tweet ID is required" }, { status: 400 })
    }

    const xApiClient = new MockXApiClient()
    const userInfo = await xApiClient.getMe()
    const userId = userInfo.data.id

    // Add bookmark
    await xApiClient.addBookmark(userId, tweetId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adding mock bookmark:", error)
    return NextResponse.json({ error: "Failed to add mock bookmark" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tweetId = searchParams.get("tweetId")

    if (!tweetId) {
      return NextResponse.json({ error: "Tweet ID is required" }, { status: 400 })
    }

    const xApiClient = new MockXApiClient()
    const userInfo = await xApiClient.getMe()
    const userId = userInfo.data.id

    // Remove bookmark
    await xApiClient.removeBookmark(userId, tweetId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing mock bookmark:", error)
    return NextResponse.json({ error: "Failed to remove mock bookmark" }, { status: 500 })
  }
} 