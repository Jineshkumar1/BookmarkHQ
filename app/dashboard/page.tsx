"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { BookmarkCard } from "@/components/bookmark-card"
import { BookmarkFilters } from "@/components/bookmark-filters"
import { StatsOverview } from "@/components/stats-overview"
import { Button } from "@/components/ui/button"
import { RefreshCw, Bookmark, AlertCircle, Clock } from "lucide-react"
import { toast } from "sonner"

interface Bookmark {
  id: string
  text: string
  author: {
    name: string
    username: string
    avatar: string
    verified: boolean
  }
  createdAt: string
  bookmarkedAt: string
  metrics: {
    likes: number
    retweets: number
    replies: number
    quotes: number
  }
  media: any[]
  tags: string[]
  category: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rateLimitInfo, setRateLimitInfo] = useState<any>(null)

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    redirect("/auth/signin")
  }

  // Available categories for filtering
  const categories = ["all", "Tech", "Education", "Business", "Entertainment", "Sports", "General"]

  // Fetch bookmarks from API with rate limit handling
  const fetchBookmarks = async (maxResults = 10) => {
    setIsLoading(true)
    setError(null)
    setRateLimitInfo(null)
    
    try {
      const response = await fetch(`/api/bookmarks?maxResults=${maxResults}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        
        if (response.status === 429) {
          setError("Rate limit exceeded. Please wait 15 minutes before trying again.")
          toast.error("Rate limit exceeded. Please wait 15 minutes.")
          return
        }
        
        throw new Error(errorData.error || 'Failed to fetch bookmarks')
      }
      
      const data = await response.json()
      setBookmarks(data.bookmarks || [])
      setRateLimitInfo(data.rateLimitInfo)
      
      if (data.bookmarks?.length > 0) {
        toast.success(`Fetched ${data.bookmarks.length} bookmarks`)
      } else {
        toast.info("No bookmarks found")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch bookmarks'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error('Error fetching bookmarks:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Sync bookmarks (same as fetch for now)
  const syncBookmarks = async () => {
    setIsSyncing(true)
    await fetchBookmarks(10) // Reduced to avoid rate limits
    setIsSyncing(false)
  }

  // Load bookmarks on component mount with reduced count
  useEffect(() => {
    fetchBookmarks(10) // Start with fewer bookmarks to avoid rate limits
  }, [])

  // Filter bookmarks based on selected category
  const filteredBookmarks = selectedCategory === "all" 
    ? bookmarks 
    : bookmarks.filter(bookmark => bookmark.category === selectedCategory)

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-8">
              <BookmarkFilters 
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
              
              <div className="mt-6">
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={syncBookmarks}
                  disabled={isSyncing}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Syncing...' : 'Sync Bookmarks'}
                </Button>
              </div>

              {rateLimitInfo && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <Clock className="h-4 w-4" />
                    <p className="text-sm">Fetched {rateLimitInfo.remaining} of {rateLimitInfo.maxResults} bookmarks</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome back, {session.user?.name || session.user?.username}!
              </h1>
              <p className="text-muted-foreground">
                Manage and organize your X.com bookmarks
              </p>
            </div>

            <StatsOverview bookmarks={bookmarks} />

            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground">
                  Your Bookmarks
                </h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Bookmark className="h-4 w-4" />
                  {isLoading ? 'Loading...' : `${filteredBookmarks.length} bookmarks`}
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <RefreshCw className="h-12 w-12 animate-spin text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading your bookmarks...</p>
                </div>
              ) : filteredBookmarks.length === 0 ? (
                <div className="text-center py-12">
                  <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {selectedCategory === "all" ? "No bookmarks found" : `No bookmarks in ${selectedCategory}`}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {selectedCategory === "all" 
                      ? "You don't have any bookmarks yet, or there was an issue fetching them."
                      : `Try selecting a different category or sync your bookmarks.`
                    }
                  </p>
                  <Button onClick={syncBookmarks} disabled={isSyncing}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Syncing...' : 'Sync Bookmarks'}
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {filteredBookmarks.map((bookmark) => (
                    <BookmarkCard key={bookmark.id} bookmark={bookmark} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 