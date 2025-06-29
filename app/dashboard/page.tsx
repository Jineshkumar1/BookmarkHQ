import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Navbar } from "@/components/navbar"
import { BookmarkCard } from "@/components/bookmark-card"
import { BookmarkFilters } from "@/components/bookmark-filters"
import { StatsOverview } from "@/components/stats-overview"
import { Button } from "@/components/ui/button"
import { RefreshCw, Bookmark } from "lucide-react"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  // For now, we'll show a placeholder. In a real app, you'd fetch bookmarks here
  const mockBookmarks = [
    {
      id: "1",
      text: "Just discovered an amazing new JavaScript framework! 🚀 #webdev #javascript",
      author: {
        name: "John Doe",
        username: "johndoe",
        avatar: "/placeholder-user.jpg",
        verified: true,
      },
      createdAt: "2024-01-15T10:30:00Z",
      bookmarkedAt: "2024-01-15T11:00:00Z",
      metrics: {
        likes: 150,
        retweets: 25,
        replies: 10,
        quotes: 5,
      },
      media: [],
      tags: ["webdev", "javascript"],
      category: "Tech",
    },
    {
      id: "2",
      text: "Great article about React performance optimization techniques. Must read for React developers! 📚",
      author: {
        name: "Jane Smith",
        username: "janesmith",
        avatar: "/placeholder-user.jpg",
        verified: false,
      },
      createdAt: "2024-01-14T15:45:00Z",
      bookmarkedAt: "2024-01-14T16:00:00Z",
      metrics: {
        likes: 89,
        retweets: 12,
        replies: 8,
        quotes: 3,
      },
      media: [],
      tags: ["react", "performance"],
      category: "Tech",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-8">
              <BookmarkFilters />
              
              <div className="mt-6">
                <Button className="w-full" variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sync Bookmarks
                </Button>
              </div>
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

            <StatsOverview />

            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground">
                  Your Bookmarks
                </h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Bookmark className="h-4 w-4" />
                  {mockBookmarks.length} bookmarks
                </div>
              </div>

              {mockBookmarks.length === 0 ? (
                <div className="text-center py-12">
                  <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No bookmarks yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Your bookmarks from X.com will appear here once you sync them.
                  </p>
                  <Button>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync Bookmarks
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {mockBookmarks.map((bookmark) => (
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