"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, CheckCircle, XCircle, AlertCircle, User, Key } from "lucide-react"
import { toast } from "sonner"

export default function TestPage() {
  const { data: session, status } = useSession()
  const [isTesting, setIsTesting] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)

  const runTests = async () => {
    setIsTesting(true)
    setTestResults(null)

    const results = {
      session: null,
      userInfo: null,
      bookmarks: null,
      errors: []
    }

    try {
      // Test 1: Check session
      if (session) {
        results.session = {
          success: true,
          data: {
            user: session.user,
            hasAccessToken: !!session.accessToken,
            hasRefreshToken: !!session.refreshToken
          }
        }
      } else {
        results.errors.push("No session found")
      }

      // Test 2: Test user info API
      try {
        const userResponse = await fetch('/api/bookmarks?maxResults=1')
        if (userResponse.ok) {
          const userData = await userResponse.json()
          results.userInfo = {
            success: true,
            data: userData.user
          }
        } else {
          const errorData = await userResponse.json()
          results.userInfo = {
            success: false,
            error: errorData.error
          }
          results.errors.push(`User info failed: ${errorData.error}`)
        }
      } catch (error) {
        results.userInfo = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
        results.errors.push(`User info error: ${error}`)
      }

      // Test 3: Test bookmarks API
      try {
        const bookmarksResponse = await fetch('/api/bookmarks?maxResults=5')
        if (bookmarksResponse.ok) {
          const bookmarksData = await bookmarksResponse.json()
          results.bookmarks = {
            success: true,
            data: {
              count: bookmarksData.bookmarks?.length || 0,
              hasMeta: !!bookmarksData.meta,
              sample: bookmarksData.bookmarks?.[0] || null
            }
          }
        } else {
          const errorData = await bookmarksResponse.json()
          results.bookmarks = {
            success: false,
            error: errorData.error
          }
          results.errors.push(`Bookmarks failed: ${errorData.error}`)
        }
      } catch (error) {
        results.bookmarks = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
        results.errors.push(`Bookmarks error: ${error}`)
      }

    } catch (error) {
      results.errors.push(`General error: ${error}`)
    }

    setTestResults(results)
    setIsTesting(false)

    if (results.errors.length === 0) {
      toast.success("All tests passed!")
    } else {
      toast.error(`${results.errors.length} test(s) failed`)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to test the X.com API integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="/auth/signin">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">X.com API Test Suite</h1>
          <p className="text-muted-foreground">
            Test your X.com API integration and debug any issues
          </p>
        </div>

        <div className="mb-6">
          <Button onClick={runTests} disabled={isTesting} size="lg">
            <RefreshCw className={`mr-2 h-4 w-4 ${isTesting ? 'animate-spin' : ''}`} />
            {isTesting ? 'Running Tests...' : 'Run API Tests'}
          </Button>
        </div>

        {testResults && (
          <div className="grid gap-6">
            {/* Session Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Session Test
                  {testResults.session?.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {testResults.session?.success ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">User</Badge>
                      <span>{testResults.session.data.user.name || testResults.session.data.user.username}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={testResults.session.data.hasAccessToken ? "default" : "destructive"}>
                        Access Token
                      </Badge>
                      <span>{testResults.session.data.hasAccessToken ? "Present" : "Missing"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={testResults.session.data.hasRefreshToken ? "default" : "secondary"}>
                        Refresh Token
                      </Badge>
                      <span>{testResults.session.data.hasRefreshToken ? "Present" : "Missing"}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-red-600">No session data available</p>
                )}
              </CardContent>
            </Card>

            {/* User Info Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  User Info Test
                  {testResults.userInfo?.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {testResults.userInfo?.success ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">ID</Badge>
                      <span>{testResults.userInfo.data.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Username</Badge>
                      <span>@{testResults.userInfo.data.username}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Name</Badge>
                      <span>{testResults.userInfo.data.name}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-red-600">
                    <p className="font-medium">Error:</p>
                    <p>{testResults.userInfo?.error}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bookmarks Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Bookmarks Test
                  {testResults.bookmarks?.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {testResults.bookmarks?.success ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Count</Badge>
                      <span>{testResults.bookmarks.data.count} bookmarks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Has Meta</Badge>
                      <span>{testResults.bookmarks.data.hasMeta ? "Yes" : "No"}</span>
                    </div>
                    {testResults.bookmarks.data.sample && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-1">Sample Bookmark:</p>
                        <p className="text-sm text-muted-foreground">
                          {testResults.bookmarks.data.sample.text.substring(0, 100)}...
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-red-600">
                    <p className="font-medium">Error:</p>
                    <p>{testResults.bookmarks?.error}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Errors Summary */}
            {testResults.errors.length > 0 && (
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    Errors Found ({testResults.errors.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {testResults.errors.map((error: string, index: number) => (
                      <li key={index} className="text-sm text-red-600 flex items-start gap-2">
                        <span className="text-red-500">•</span>
                        <span>{error}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Troubleshooting Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Troubleshooting Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">If you see "Insufficient permissions":</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Make sure your X.com app has "Read and Write" permissions</li>
                <li>• Check that your app is approved for the `bookmark.read` scope</li>
                <li>• Verify your callback URL is exactly: `http://localhost:3001/api/auth/callback/twitter`</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">If you see "Authentication expired":</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Sign out and sign back in</li>
                <li>• Check your `.env.local` file has the correct API keys</li>
                <li>• Verify your X.com app settings</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">If you see "No bookmarks found":</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Make sure you have bookmarks in your X.com account</li>
                <li>• Check that your app has the correct permissions</li>
                <li>• Try the sync button in the dashboard</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 