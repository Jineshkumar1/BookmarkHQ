"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, User } from "lucide-react"

export default function TestAuthPage() {
  const { data: session, status } = useSession()

  const handleSignIn = () => {
    signIn("twitter", { callbackUrl: "/dashboard" })
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Authentication Test</h1>
          <p className="text-muted-foreground">
            Test the Twitter OAuth flow step by step
          </p>
        </div>

        <div className="grid gap-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Authentication Status
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
                    {status === "authenticated" && "Successfully authenticated with Twitter"}
                    {status === "unauthenticated" && "Not authenticated"}
                  </span>
                </div>

                {session && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">User</Badge>
                      <span>{session.user?.name || "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Username</Badge>
                      <span>@{session.user?.username || "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={session.accessToken ? "default" : "destructive"}>
                        Access Token
                      </Badge>
                      <span>{session.accessToken ? "Present" : "Missing"}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Test Actions</CardTitle>
              <CardDescription>
                Try these actions to test the authentication flow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                {status === "unauthenticated" ? (
                  <Button onClick={handleSignIn} className="bg-blue-500 hover:bg-blue-600">
                    Sign in with X.com
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
                    Sign Out
                  </Button>
                )}
                <Button asChild variant="outline">
                  <a href="/debug">Go to Debug Page</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/dashboard">Go to Dashboard</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Troubleshooting Card */}
          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">If sign-in fails:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Check your Twitter app callback URL is: <code>http://localhost:3000/api/auth/callback/twitter</code></li>
                    <li>• Verify your app has the required scopes: tweet.read, users.read, bookmark.read, offline.access</li>
                    <li>• Make sure your Twitter app is approved and active</li>
                    <li>• Check the browser console for any error messages</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">If you get redirected back to sign-in:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Clear your browser cookies and try again</li>
                    <li>• Check that your Twitter credentials in .env.local are correct</li>
                    <li>• Make sure NEXTAUTH_URL is set to http://localhost:3000</li>
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