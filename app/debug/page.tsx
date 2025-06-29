"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { User, Key, AlertCircle, CheckCircle } from "lucide-react"

export default function DebugPage() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Debug Session</h1>
          <p className="text-muted-foreground">
            Check your authentication status and session data
          </p>
        </div>

        <div className="grid gap-6">
          {/* Session Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Session Status
                {status === "authenticated" ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant={status === "authenticated" ? "default" : "destructive"}>
                    {status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {status === "loading" && "Checking authentication..."}
                    {status === "authenticated" && "Successfully authenticated"}
                    {status === "unauthenticated" && "Not authenticated"}
                  </span>
                </div>

                {session && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">User</Badge>
                      <span>{session.user?.name || session.user?.username}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Email</Badge>
                      <span>{session.user?.email || "No email"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Username</Badge>
                      <span>@{session.user?.username || "No username"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={session.accessToken ? "default" : "destructive"}>
                        Access Token
                      </Badge>
                      <span>{session.accessToken ? "Present" : "Missing"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={session.refreshToken ? "default" : "secondary"}>
                        Refresh Token
                      </Badge>
                      <span>{session.refreshToken ? "Present" : "Missing"}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Environment Check */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Environment Variables
              </CardTitle>
              <CardDescription>
                Check if required environment variables are set
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={process.env.NEXT_PUBLIC_NEXTAUTH_URL ? "default" : "destructive"}>
                    NEXTAUTH_URL
                  </Badge>
                  <span className="text-sm">{process.env.NEXT_PUBLIC_NEXTAUTH_URL || "Not set"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID ? "default" : "destructive"}>
                    TWITTER_CLIENT_ID
                  </Badge>
                  <span className="text-sm">
                    {process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID 
                      ? `${process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID.substring(0, 8)}...` 
                      : "Not set"
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Current URL</Badge>
                  <span className="text-sm">{typeof window !== 'undefined' ? window.location.origin : "Server side"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button asChild>
                  <a href="/dashboard">Go to Dashboard</a>
                </Button>
                <Button asChild>
                  <a href="/auth/signin">Sign In</a>
                </Button>
                {session && (
                  <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
                    Sign Out
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Troubleshooting */}
          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">If you're stuck in a redirect loop:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Check your X.com app callback URL is set to: <code>http://localhost:3000/api/auth/callback/twitter</code></li>
                    <li>• Make sure NEXTAUTH_URL in .env.local is: <code>http://localhost:3000</code></li>
                    <li>• Clear your browser cookies and try again</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">If authentication fails:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Verify your TWITTER_CLIENT_ID and TWITTER_CLIENT_SECRET are correct</li>
                    <li>• Check your X.com app has the right permissions</li>
                    <li>• Make sure your app is approved for the required scopes</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">If you see module errors:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Clear the .next folder: <code>Remove-Item -Recurse -Force .next</code></li>
                    <li>• Restart the dev server: <code>npm run dev</code></li>
                    <li>• Check that all environment variables are set in .env.local</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 