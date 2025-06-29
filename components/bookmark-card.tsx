import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Repeat2, ExternalLink, Calendar } from "lucide-react"
import Image from "next/image"

interface MediaItem {
  type: string
  url: string
  width?: number
  height?: number
  alt_text?: string
  media_key?: string
}

interface Bookmark {
  id: string
  text: string
  author: {
    name: string
    username: string
    avatar: string
    verified?: boolean
  }
  createdAt: string
  bookmarkedAt: string
  metrics: {
    likes: number
    retweets: number
    replies: number
    quotes?: number
  }
  media?: MediaItem[]
  tags: string[]
  category: string
}

interface BookmarkCardProps {
  bookmark: Bookmark
  viewMode?: "grid" | "list"
}

export function BookmarkCard({ bookmark, viewMode = "list" }: BookmarkCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  const renderMedia = (media: MediaItem[]) => {
    if (!media || media.length === 0) return null

    const firstMedia = media[0]
    
    if (firstMedia.type === "photo") {
      return (
        <div className="mb-3">
          <Image
            src={firstMedia.url}
            alt={firstMedia.alt_text || "Tweet media"}
            width={400}
            height={200}
            className="rounded-lg object-cover w-full max-w-md"
          />
        </div>
      )
    }

    if (firstMedia.type === "video") {
      return (
        <div className="mb-3">
          <div className="relative w-full max-w-md aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center mx-auto mb-2">
                <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Video</p>
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Avatar className="w-12 h-12 flex-shrink-0">
              <AvatarImage src={bookmark.author.avatar || "/placeholder.svg"} alt={bookmark.author.name} />
              <AvatarFallback>{bookmark.author.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-slate-900 dark:text-slate-100">{bookmark.author.name}</span>
                {bookmark.author.verified && (
                  <Badge variant="outline" className="text-xs px-1">
                    ✓
                  </Badge>
                )}
                <span className="text-slate-500 dark:text-slate-400">@{bookmark.author.username}</span>
                <span className="text-slate-400 dark:text-slate-500">·</span>
                <span className="text-slate-500 dark:text-slate-400 text-sm">{formatDate(bookmark.createdAt)}</span>
              </div>

              <p className="text-slate-800 dark:text-slate-200 mb-3 leading-relaxed">{bookmark.text}</p>

              {renderMedia(bookmark.media || [])}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">{formatNumber(bookmark.metrics.replies)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Repeat2 className="w-4 h-4" />
                    <span className="text-sm">{formatNumber(bookmark.metrics.retweets)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{formatNumber(bookmark.metrics.likes)}</span>
                  </div>
                  {bookmark.metrics.quotes && (
                    <div className="flex items-center gap-1">
                      <ExternalLink className="w-4 h-4" />
                      <span className="text-sm">{formatNumber(bookmark.metrics.quotes)}</span>
                    </div>
                  )}
                </div>

                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <Badge variant="secondary" className="text-xs">
                  {bookmark.category}
                </Badge>
                {bookmark.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={bookmark.author.avatar || "/placeholder.svg"} alt={bookmark.author.name} />
            <AvatarFallback>{bookmark.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">{bookmark.author.name}</span>
              {bookmark.author.verified && (
                <Badge variant="outline" className="text-xs px-1">
                  ✓
                </Badge>
              )}
              <span className="text-slate-500 dark:text-slate-400 text-sm truncate">@{bookmark.author.username}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(bookmark.createdAt)}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-slate-800 dark:text-slate-200 mb-3 leading-relaxed line-clamp-4">{bookmark.text}</p>

        {renderMedia(bookmark.media || [])}

        <div className="flex items-center justify-between mb-3 text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{formatNumber(bookmark.metrics.replies)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Repeat2 className="w-4 h-4" />
              <span className="text-sm">{formatNumber(bookmark.metrics.retweets)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span className="text-sm">{formatNumber(bookmark.metrics.likes)}</span>
            </div>
            {bookmark.metrics.quotes && (
              <div className="flex items-center gap-1">
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm">{formatNumber(bookmark.metrics.quotes)}</span>
              </div>
            )}
          </div>

          <Button variant="ghost" size="sm">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <Badge variant="secondary" className="text-xs">
            {bookmark.category}
          </Badge>
          <div className="flex flex-wrap gap-1">
            {bookmark.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {bookmark.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{bookmark.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
