import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { createXApiClient, processBookmarkData } from "@/lib/x-api"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!session.accessToken) {
      return NextResponse.json({ error: "No access token available" }, { status: 400 })
    }

    const { searchParams } = new URL(request.url)
    const maxResults = parseInt(searchParams.get("maxResults") || "10") // Reduced default to avoid rate limits
    const paginationToken = searchParams.get("paginationToken")

    // Limit maxResults to prevent rate limiting
    const safeMaxResults = Math.min(maxResults, 20)

    // Create X API client
    const xApiClient = createXApiClient(session)

    // Get current user info
    const userInfo = await xApiClient.getMe()
    const userId = userInfo.data.id

    // Fetch bookmarks with enhanced media fields
    const bookmarksResponse = await xApiClient.getBookmarks(userId, {
      maxResults: safeMaxResults,
      paginationToken: paginationToken || undefined,
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

    // Process the bookmark data
    const processedBookmarks = processBookmarkData(bookmarksResponse)

    return NextResponse.json({
      bookmarks: processedBookmarks,
      meta: bookmarksResponse.meta,
      user: userInfo.data,
      rateLimitInfo: {
        remaining: bookmarksResponse.meta?.result_count || 0,
        maxResults: safeMaxResults,
      },
    })
  } catch (error) {
    console.error("Error fetching bookmarks:", error)
    
    if (error instanceof Error) {
      if (error.message.includes("Rate limit exceeded")) {
        return NextResponse.json({ 
          error: "Rate limit exceeded. Please try again in 15 minutes.",
          retryAfter: "15 minutes"
        }, { status: 429 })
      }
      if (error.message.includes("401")) {
        return NextResponse.json({ error: "Authentication expired. Please sign in again." }, { status: 401 })
      }
      if (error.message.includes("403")) {
        return NextResponse.json({ error: "Insufficient permissions. Please check your X.com app settings." }, { status: 403 })
      }
      if (error.message.includes("429")) {
        return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 })
      }
    }

    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { tweetId } = body

    if (!tweetId) {
      return NextResponse.json({ error: "Tweet ID is required" }, { status: 400 })
    }

    const xApiClient = createXApiClient(session)
    const userInfo = await xApiClient.getMe()
    const userId = userInfo.data.id

    // Add bookmark
    await xApiClient.addBookmark(userId, tweetId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adding bookmark:", error)
    return NextResponse.json({ error: "Failed to add bookmark" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tweetId = searchParams.get("tweetId")

    if (!tweetId) {
      return NextResponse.json({ error: "Tweet ID is required" }, { status: 400 })
    }

    const xApiClient = createXApiClient(session)
    const userInfo = await xApiClient.getMe()
    const userId = userInfo.data.id

    // Remove bookmark
    await xApiClient.removeBookmark(userId, tweetId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing bookmark:", error)
    return NextResponse.json({ error: "Failed to remove bookmark" }, { status: 500 })
  }
} 