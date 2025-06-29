"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  RefreshCw, 
  Database, 
  Clock, 
  AlertCircle, 
  Search, 
  User, 
  Bookmark, 
  TrendingUp,
  Filter,
  Grid,
  List,
  Heart,
  MessageCircle,
  Repeat,
  Quote
} from "lucide-react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ThemeToggle } from "@/components/theme-toggle"

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

interface UserInfo {
  id: string
  name: string
  username: string
  profile_image_url: string
  verified: boolean
  public_metrics: {
    followers_count: number
    following_count: number
    tweet_count: number
    listed_count: number
  }
}

interface RateLimitInfo {
  bookmarks: {
    limit: number
    remaining: number
    reset: string
    window: string
  }
  user: {
    limit: number
    remaining: number
    reset: string
    window: string
  }
  search: {
    limit: number
    remaining: number
    reset: string
    window: string
  }
  tweets: {
    limit: number
    remaining: number
    reset: string
    window: string
  }
}

export default function MockDashboardPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [rateLimits, setRateLimits] = useState<RateLimitInfo | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [error, setError] = useState<string | null>(null)
  const [rateLimitsOpen, setRateLimitsOpen] = useState(false)
  const [userInfoOpen, setUserInfoOpen] = useState(false)

  const categories = ["all", "Tech", "Business", "Education", "Creative", "Health", "Lifestyle", "Entertainment"]

  const fetchBookmarks = async (forceRefresh = false) => {
    console.log("Fetching mock bookmarks, forceRefresh:", forceRefresh)
    setIsLoading(true)
    setError(null)
    
    try {
      const url = `/api/mock/bookmarks?maxResults=20${forceRefresh ? '&forceRefresh=true' : ''}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log("Mock API Response:", data)
      
      setBookmarks(data.bookmarks || [])
      
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

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('/api/mock/user')
      if (response.ok) {
        const data = await response.json()
        setUserInfo(data.user)
      }
    } catch (error) {
      console.error('Error fetching user info:', error)
    }
  }

  const fetchRateLimits = async () => {
    try {
      const response = await fetch('/api/mock/rate-limits')
      if (response.ok) {
        const data = await response.json()
        setRateLimits(data.rateLimits)
      }
    } catch (error) {
      console.error('Error fetching rate limits:', error)
    }
  }

  const searchTweets = async () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    try {
      const response = await fetch(`/api/mock/search?query=${encodeURIComponent(searchQuery)}&maxResults=10`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.tweets || [])
        toast.success(`Found ${data.tweets?.length || 0} tweets for "${searchQuery}"`)
      }
    } catch (error) {
      console.error('Error searching tweets:', error)
      toast.error('Failed to search tweets')
    } finally {
      setIsSearching(false)
    }
  }

  const refreshBookmarks = async () => {
    setIsRefreshing(true)
    await fetchBookmarks(true)
    setIsRefreshing(false)
  }

  const filteredBookmarks = bookmarks.filter(bookmark => 
    selectedCategory === "all" || bookmark.category === selectedCategory
  )

  useEffect(() => {
    fetchBookmarks()
    fetchUserInfo()
    fetchRateLimits()
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">BookmarkHQ – Mock Dashboard</h1>
            <p className="text-muted-foreground">Testing X.com API functionality with mock data</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Profile Modal */}
            <Dialog open={userInfoOpen} onOpenChange={setUserInfoOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setUserInfoOpen(true)}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    User Information
                  </DialogTitle>
                </DialogHeader>
                {userInfo ? (
                  <div className="flex items-center gap-4 mt-4">
                    <img 
                      src={userInfo.profile_image_url} 
                      alt={userInfo.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        {userInfo.name}
                        {userInfo.verified && <Badge variant="secondary">Verified</Badge>}
                      </h3>
                      <p className="text-muted-foreground">@{userInfo.username}</p>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span>{formatNumber(userInfo.public_metrics.followers_count)} Followers</span>
                        <span>{formatNumber(userInfo.public_metrics.following_count)} Following</span>
                        <span>{formatNumber(userInfo.public_metrics.tweet_count)} Tweets</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-4">No user info data.</div>
                )}
              </DialogContent>
            </Dialog>
            {/* Rate Limits Modal */}
            <Dialog open={rateLimitsOpen} onOpenChange={setRateLimitsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setRateLimitsOpen(true)}>
                  <Clock className="mr-2 h-4 w-4" />
                  Rate Limits
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Rate Limits
                  </DialogTitle>
                </DialogHeader>
                {rateLimits ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {Object.entries(rateLimits).map(([endpoint, limits]) => (
                      <div key={endpoint} className="text-center">
                        <h4 className="font-medium capitalize">{endpoint}</h4>
                        <p className="text-2xl font-bold text-green-600">{limits.remaining}</p>
                        <p className="text-xs text-muted-foreground">of {limits.limit}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-4">No rate limit data.</div>
                )}
              </DialogContent>
            </Dialog>
            <Button onClick={refreshBookmarks} disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <ThemeToggle />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookmarks</CardTitle>
              <Bookmark className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookmarks.length}</div>
              <p className="text-xs text-muted-foreground">Mock data</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Set(bookmarks.map(b => b.category)).size}</div>
              <p className="text-xs text-muted-foreground">Unique categories</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">With Media</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookmarks.filter(b => b.media.length > 0).length}</div>
              <p className="text-xs text-muted-foreground">Bookmarks with images</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified Authors</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookmarks.filter(b => b.author.verified).length}</div>
              <p className="text-xs text-muted-foreground">Verified accounts</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Tweets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Search for tweets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchTweets()}
              />
              <Button onClick={searchTweets} disabled={isSearching || !searchQuery.trim()}>
                <Search className="mr-2 h-4 w-4" />
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </div>
            
            {searchResults.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Search Results ({searchResults.length})</h4>
                <div className="space-y-2">
                  {searchResults.map((tweet) => (
                    <div key={tweet.id} className="p-3 border rounded-lg">
                      <p className="text-sm">{tweet.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(tweet.created_at)} • {formatNumber(tweet.public_metrics.likes)} likes
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="bookmarks" className="space-y-4">
          <TabsList>
            <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
          </TabsList>

          <TabsContent value="bookmarks" className="space-y-4">
            {/* Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Bookmarks Grid/List */}
            {isLoading ? (
              <div className="text-center py-12">
                <RefreshCw className="h-12 w-12 animate-spin text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Loading mock bookmarks...</p>
              </div>
            ) : filteredBookmarks.length === 0 ? (
              <div className="text-center py-12">
                <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No bookmarks found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try refreshing or changing the category filter.
                </p>
                <Button onClick={() => fetchBookmarks(false)}>
                  <Database className="mr-2 h-4 w-4" />
                  Load Bookmarks
                </Button>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {filteredBookmarks.map((bookmark) => (
                  <Card key={bookmark.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={bookmark.author.avatar} 
                          alt={bookmark.author.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold truncate">{bookmark.author.name}</h3>
                            {bookmark.author.verified && <Badge variant="secondary" className="text-xs">✓</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">@{bookmark.author.username}</p>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-foreground mb-4 line-clamp-3">{bookmark.text}</p>
                      
                      {bookmark.media.length > 0 && (
                        <div className="mb-4">
                          <img 
                            src={bookmark.media[0].url} 
                            alt={bookmark.media[0].alt_text || "Media"}
                            className="rounded-lg w-full h-48 object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                        <span>{formatDate(bookmark.createdAt)}</span>
                        <Badge variant="outline">{bookmark.category}</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {formatNumber(bookmark.metrics.likes)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Repeat className="h-3 w-3" />
                            {formatNumber(bookmark.metrics.retweets)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {formatNumber(bookmark.metrics.replies)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Quote className="h-3 w-3" />
                            {formatNumber(bookmark.metrics.quotes)}
                          </span>
                        </div>
                      </div>
                      
                      {bookmark.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {bookmark.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                          {bookmark.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{bookmark.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="search" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Testing</CardTitle>
                <CardDescription>Test different mock API endpoints and error scenarios</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => fetch('/api/mock/rate-limits?simulateError=rate_limit')}
                  >
                    Test Rate Limit Error
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => fetch('/api/mock/rate-limits?simulateError=auth_error')}
                  >
                    Test Auth Error
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => fetch('/api/mock/tweets/nonexistent')}
                  >
                    Test 404 Error
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => fetch('/api/mock/user')}
                  >
                    Test User API
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 