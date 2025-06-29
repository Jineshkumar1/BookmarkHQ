"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Database, Clock, AlertCircle } from "lucide-react"
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

export default function TestMockPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [cacheInfo, setCacheInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchBookmarks = async (forceRefresh = false) => {
    console.log("Fetching mock bookmarks, forceRefresh:", forceRefresh)
    setIsLoading(true)
    setError(null)
    
    try {
      const url = `/api/mock/bookmarks?maxResults=10${forceRefresh ? '&forceRefresh=true' : ''}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log("Mock API Response:", data)
      
      setBookmarks(data.bookmarks || [])
      setCacheInfo({
        source: data.rateLimitInfo?.source || 'unknown',
        cached: data.cached || false,
        lastSynced: data.last_synced_at,
        count: data.bookmarks?.length || 0
      })
      
      const source = data.cached ? 'mock cache' : 'mock API'
      toast.success(`Fetched ${data.bookmarks?.length || 0} bookmarks from ${source}`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch bookmarks'
      console.error('Error fetching mock bookmarks:', err)
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshBookmarks = async () => {
    setIsRefreshing(true)
    await fetchBookmarks(true) // Force refresh
    setIsRefreshing(false)
  }

  useEffect(() => {
    fetchBookmarks()
  }, [])

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Mock API Test - Caching System
          </h1>
          <p className="text-muted-foreground">
            Testing the caching functionality with mock data to bypass X.com rate limits
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cache Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Cache Status
              </CardTitle>
              <CardDescription>
                Mock caching system status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cacheInfo ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Source:</span>
                    <Badge variant={cacheInfo.cached ? "default" : "secondary"}>
                      {cacheInfo.source}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Cached:</span>
                    <Badge variant={cacheInfo.cached ? "default" : "outline"}>
                      {cacheInfo.cached ? "Yes" : "No"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Count:</span>
                    <span className="text-sm font-medium">{cacheInfo.count}</span>
                  </div>
                  
                  {cacheInfo.lastSynced && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Sync:</span>
                      <span className="text-sm font-medium">
                        {new Date(cacheInfo.lastSynced).toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No cache info available</p>
              )}
            </CardContent>
          </Card>

          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Controls
              </CardTitle>
              <CardDescription>
                Test the caching system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full" 
                onClick={() => fetchBookmarks(false)}
                disabled={isLoading}
              >
                <Database className="mr-2 h-4 w-4" />
                {isLoading ? 'Loading...' : 'Load from Cache'}
              </Button>
              
              <Button 
                className="w-full" 
                variant="outline"
                onClick={refreshBookmarks}
                disabled={isRefreshing}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Force Refresh'}
              </Button>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Information
              </CardTitle>
              <CardDescription>
                About this test
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• This page uses mock data to test caching</p>
                <p>• "Load from Cache" simulates cached data</p>
                <p>• "Force Refresh" simulates fresh API call</p>
                <p>• No real X.com API calls are made</p>
                <p>• Perfect for testing without rate limits</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookmarks Display */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-foreground">
              Mock Bookmarks
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Database className="h-4 w-4" />
              {isLoading ? 'Loading...' : `${bookmarks.length} bookmarks`}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-12 w-12 animate-spin text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Loading mock bookmarks...</p>
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="text-center py-12">
              <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No bookmarks found
              </h3>
              <p className="text-muted-foreground mb-4">
                Try loading bookmarks from cache or refreshing.
              </p>
              <Button onClick={() => fetchBookmarks(false)}>
                <Database className="mr-2 h-4 w-4" />
                Load Bookmarks
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {bookmarks.map((bookmark) => (
                <Card key={bookmark.id}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <img 
                        src={bookmark.author.avatar} 
                        alt={bookmark.author.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{bookmark.author.name}</h3>
                          {bookmark.author.verified && (
                            <Badge variant="outline" className="text-xs">Verified</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          @{bookmark.author.username} • {new Date(bookmark.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground mb-4">{bookmark.text}</p>
                    
                    {bookmark.media.length > 0 && (
                      <div className="mb-4">
                        <img 
                          src={bookmark.media[0].url} 
                          alt={bookmark.media[0].alt_text || "Media"}
                          className="rounded-lg max-w-full h-auto"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>❤️ {bookmark.metrics.likes}</span>
                        <span>🔄 {bookmark.metrics.retweets}</span>
                        <span>💬 {bookmark.metrics.replies}</span>
                        <span>📝 {bookmark.metrics.quotes}</span>
                      </div>
                      <Badge variant="outline">{bookmark.category}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 