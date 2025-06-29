import { Card, CardContent } from "@/components/ui/card"
import { Calendar, BookmarkIcon, TrendingUp, Clock } from "lucide-react"

interface StatsOverviewProps {
  bookmarks: {
    id: string
    bookmarkedAt: string
    category: string
  }[]
}

export function StatsOverview({ bookmarks }: StatsOverviewProps) {
  const totalBookmarks = bookmarks.length
  const todayBookmarks = bookmarks.filter((b) => {
    const today = new Date().toDateString()
    const bookmarkDate = new Date(b.bookmarkedAt).toDateString()
    return today === bookmarkDate
  }).length

  const categories = Array.from(new Set(bookmarks.map((b) => b.category))).length
  const thisWeekBookmarks = bookmarks.filter((b) => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return new Date(b.bookmarkedAt) > weekAgo
  }).length

  const stats = [
    {
      label: "Total Bookmarks",
      value: totalBookmarks,
      icon: BookmarkIcon,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Added Today",
      value: todayBookmarks,
      icon: Calendar,
      color: "text-green-600 dark:text-green-400",
    },
    {
      label: "Categories",
      value: categories,
      icon: TrendingUp,
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      label: "This Week",
      value: thisWeekBookmarks,
      icon: Clock,
      color: "text-orange-600 dark:text-orange-400",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800 ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
