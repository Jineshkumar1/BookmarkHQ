"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Trash2, Clock, Database } from "lucide-react"
import { toast } from "sonner"

interface CacheStatus {
  hasCache: boolean
  lastSynced: string | null
  cacheAge: number | null
  bookmarksCount: number
  isFresh: boolean
}

export function CacheStatus() {
  const [cacheStatus, setCacheStatus] = useState<CacheStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const fetchCacheStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/cache')
      if (response.ok) {
        const data = await response.json()
        setCacheStatus(data)
      } else {
        console.error('Failed to fetch cache status')
      }
    } catch (error) {
      console.error('Error fetching cache status:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearCache = async () => {
    try {
      setRefreshing(true)
      const response = await fetch('/api/cache', {
        method: 'DELETE'
      })
      
      if (response.ok) {
        toast.success('Cache cleared successfully')
        await fetchCacheStatus()
      } else {
        toast.error('Failed to clear cache')
      }
    } catch (error) {
      console.error('Error clearing cache:', error)
      toast.error('Failed to clear cache')
    } finally {
      setRefreshing(false)
    }
  }

  const refreshCache = async () => {
    try {
      setRefreshing(true)
      const response = await fetch('/api/cache', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'refresh' })
      })
      
      if (response.ok) {
        toast.success('Cache will refresh on next request')
        await fetchCacheStatus()
      } else {
        toast.error('Failed to refresh cache')
      }
    } catch (error) {
      console.error('Error refreshing cache:', error)
      toast.error('Failed to refresh cache')
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchCacheStatus()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Cache Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!cacheStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Cache Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Unable to load cache status</p>
        </CardContent>
      </Card>
    )
  }

  const formatTimeAgo = (minutes: number) => {
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Cache Status
        </CardTitle>
        <CardDescription>
          Manage your bookmarks cache to reduce API calls
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {cacheStatus.hasCache ? (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Last synced:</span>
              </div>
              <span className="text-sm font-medium">
                {cacheStatus.lastSynced ? formatTimeAgo(cacheStatus.cacheAge || 0) : 'Unknown'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Bookmarks cached:</span>
              </div>
              <span className="text-sm font-medium">{cacheStatus.bookmarksCount}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge variant={cacheStatus.isFresh ? "default" : "secondary"}>
                {cacheStatus.isFresh ? "Fresh" : "Stale"}
              </Badge>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshCache}
                disabled={refreshing}
                className="flex-1"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearCache}
                disabled={refreshing}
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <Database className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-4">
              No cache found. Your first request will fetch fresh data from X.com.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshCache}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Initialize Cache
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 