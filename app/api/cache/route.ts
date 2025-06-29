import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { createXApiClient } from "@/lib/x-api"
import { 
  supabase, 
  getCachedBookmarks, 
  clearBookmarkCache, 
  logSync 
} from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const xApiClient = createXApiClient(session)
    const userInfo = await xApiClient.getMe()
    const userId = userInfo.data.id

    // Get cache status
    const cachedData = await getCachedBookmarks(userId)
    
    if (!cachedData) {
      return NextResponse.json({
        hasCache: false,
        lastSynced: null,
        cacheAge: null,
        bookmarksCount: 0
      })
    }

    const now = new Date()
    const lastSynced = new Date(cachedData.last_synced_at)
    const cacheAge = now.getTime() - lastSynced.getTime()
    const cacheAgeMinutes = Math.floor(cacheAge / (1000 * 60))

    return NextResponse.json({
      hasCache: true,
      lastSynced: cachedData.last_synced_at,
      cacheAge: cacheAgeMinutes,
      bookmarksCount: cachedData.data.bookmarks.length,
      isFresh: cacheAge < 60 * 60 * 1000 // 1 hour
    })
  } catch (error) {
    console.error("Error getting cache status:", error)
    return NextResponse.json({ error: "Failed to get cache status" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const xApiClient = createXApiClient(session)
    const userInfo = await xApiClient.getMe()
    const userId = userInfo.data.id

    // Clear cache
    await clearBookmarkCache(userId)
    
    // Log the cache clear operation
    await logSync(userId, 'manual', 'success', { 
      bookmarksAdded: 0, 
      bookmarksUpdated: 0 
    })

    return NextResponse.json({ success: true, message: "Cache cleared successfully" })
  } catch (error) {
    console.error("Error clearing cache:", error)
    return NextResponse.json({ error: "Failed to clear cache" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { action } = body

    if (action === 'refresh') {
      // Force refresh by clearing cache and redirecting to bookmarks API
      const xApiClient = createXApiClient(session)
      const userInfo = await xApiClient.getMe()
      const userId = userInfo.data.id

      await clearBookmarkCache(userId)
      
      return NextResponse.json({ 
        success: true, 
        message: "Cache cleared. Next bookmarks request will fetch fresh data." 
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error with cache action:", error)
    return NextResponse.json({ error: "Failed to perform cache action" }, { status: 500 })
  }
} 