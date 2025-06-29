"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TestEnvPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Environment Variables Test</h1>
          <p className="text-muted-foreground">
            Check if environment variables are being loaded correctly
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>
              These should match what's in your .env.local file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">NEXTAUTH_URL</Badge>
                <span className="text-sm font-mono">
                  {process.env.NEXT_PUBLIC_NEXTAUTH_URL || "Not set (server-side only)"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">TWITTER_CLIENT_ID</Badge>
                <span className="text-sm font-mono">
                  {process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID 
                    ? `${process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID.substring(0, 10)}...` 
                    : "Not set (server-side only)"
                  }
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">TWITTER_CLIENT_SECRET</Badge>
                <span className="text-sm font-mono">
                  {process.env.NEXT_PUBLIC_TWITTER_CLIENT_SECRET 
                    ? `${process.env.NEXT_PUBLIC_TWITTER_CLIENT_SECRET.substring(0, 10)}...` 
                    : "Not set (server-side only)"
                  }
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Current URL</Badge>
                <span className="text-sm font-mono">
                  {typeof window !== 'undefined' ? window.location.origin : "Server side"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-medium text-yellow-800 mb-2">Important Notes:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• TWITTER_CLIENT_ID and TWITTER_CLIENT_SECRET are server-side only and won't show here</li>
            <li>• If you see "Not set", check your .env.local file</li>
            <li>• Make sure your Twitter app callback URL is: <code>http://localhost:3000/api/auth/callback/twitter</code></li>
            <li>• Your Twitter app needs these scopes: tweet.read, users.read, bookmark.read, offline.access</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
