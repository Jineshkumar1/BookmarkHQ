import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { createXApiClient, processBookmarkData } from "@/lib/x-api"
import { 
  supabase, 
  getCachedBookmarks, 
  updateBookmarkCache, 
  logSync, 
  isCacheFresh 
} from "@/lib/supabase"

export async function GET(request: NextRequest) {
  console.log("API: Bookmarks request received")
  
  try {
    const session = await getServerSession(authOptions)
    console.log("API: Session check result:", !!session)

    if (!session) {
      console.log("API: No session found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!session.accessToken) {
      console.log("API: No access token found")
      return NextResponse.json({ error: "No access token available" }, { status: 400 })
    }

    const { searchParams } = new URL(request.url)
    const maxResults = parseInt(searchParams.get("maxResults") || "10")
    const paginationToken = searchParams.get("paginationToken")
    const forceRefresh = searchParams.get("forceRefresh") === "true"
    
    console.log("API: Request params:", { maxResults, paginationToken, forceRefresh })

    // Get user info
    const xApiClient = createXApiClient(session)
    const userInfo = await xApiClient.getMe()
    const userId = userInfo.data.id
    console.log("API: User ID:", userId)

    // 1. Check cache (if not forceRefresh and no pagination)
    if (!forceRefresh && !paginationToken) {
      const cachedData = await getCachedBookmarks(userId)
      
      if (cachedData && isCacheFresh(cachedData.last_synced_at)) {
        console.log("API: Serving bookmarks from cache")
        await logSync(userId, 'manual', 'success', { 
          bookmarksAdded: 0, 
          bookmarksUpdated: 0 
        })
        
        return NextResponse.json({
          bookmarks: cachedData.data.bookmarks,
          meta: cachedData.data.meta,
          user: userInfo.data,
          rateLimitInfo: { source: 'cache' },
          cached: true,
          last_synced_at: cachedData.last_synced_at
        })
      }
    }

    // 2. Fetch from Twitter
    const safeMaxResults = Math.min(maxResults, 20)
    console.log("API: Safe max results:", safeMaxResults)
    
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
    
    console.log("API: Bookmarks response received:", {
      tweetCount: bookmarksResponse.data?.length || 0,
      hasIncludes: !!bookmarksResponse.includes,
      includesKeys: bookmarksResponse.includes ? Object.keys(bookmarksResponse.includes) : []
    })

    // Process the bookmark data
    const processedBookmarks = processBookmarkData(bookmarksResponse)
    console.log("API: Processed bookmarks:", processedBookmarks.length)

    // 3. Update cache (only if not paginated)
    if (!paginationToken) {
      try {
        await updateBookmarkCache(userId, processedBookmarks, bookmarksResponse.meta)
        await logSync(userId, 'manual', 'success', { 
          bookmarksAdded: processedBookmarks.length, 
          bookmarksUpdated: 0 
        })
        console.log("API: Cache updated successfully")
      } catch (cacheError) {
        console.error("API: Cache update failed:", cacheError)
        // Don't fail the request if cache update fails
      }
    }

    return NextResponse.json({
      bookmarks: processedBookmarks,
      meta: bookmarksResponse.meta,
      user: userInfo.data,
      rateLimitInfo: {
        remaining: bookmarksResponse.meta?.result_count || 0,
        maxResults: safeMaxResults,
        source: 'twitter',
      },
      cached: false,
      last_synced_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error("API: Error fetching bookmarks:", error)
    
    // Log sync error if we have a session
    try {
      const session = await getServerSession(authOptions)
      if (session?.accessToken) {
        const xApiClient = createXApiClient(session)
        const userInfo = await xApiClient.getMe()
        await logSync(userInfo.data.id, 'manual', 'error', { 
          errorMessage: error instanceof Error ? error.message : 'Unknown error' 
        })
      }
    } catch (logError) {
      console.error("API: Failed to log sync error:", logError)
    }
    
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

    // Clear cache to force refresh on next request
    try {
      await supabase
        .from('bookmarks_cache')
        .delete()
        .eq('user_id', userId)
    } catch (cacheError) {
      console.error("Failed to clear cache after adding bookmark:", cacheError)
    }

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

    // Clear cache to force refresh on next request
    try {
      await supabase
        .from('bookmarks_cache')
        .delete()
        .eq('user_id', userId)
    } catch (cacheError) {
      console.error("Failed to clear cache after removing bookmark:", cacheError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing bookmark:", error)
    return NextResponse.json({ error: "Failed to remove bookmark" }, { status: 500 })
  }
} 