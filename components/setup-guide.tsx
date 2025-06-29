"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Key, AlertTriangle, CheckCircle, Copy } from "lucide-react"
import { useState } from "react"

export function SetupGuide() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> The API credentials you provided are for OAuth 1.0a. This app requires OAuth 2.0
          credentials for better security and functionality.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Your Current Credentials (OAuth 1.0a)
          </CardTitle>
          <CardDescription>These won't work with this application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">API Key</span>
              <Badge variant="destructive">OAuth 1.0a</Badge>
            </div>
            <code className="text-sm">qpTQO63RPzkKKzv3KLkRYd86I</code>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">API Secret</span>
              <Badge variant="destructive">OAuth 1.0a</Badge>
            </div>
            <code className="text-sm">J2GtbFFW0lt7nZKSU0J3YQeSMCQZToV05ZKHaAQ58ctvgQ1r5f</code>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            What You Need (OAuth 2.0)
          </CardTitle>
          <CardDescription>Follow these steps to get the correct credentials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">
                1
              </div>
              <div>
                <p className="font-medium">Go to X Developer Portal</p>
                <p className="text-sm text-muted-foreground">Access your app settings</p>
                <Button variant="outline" size="sm" className="mt-2 bg-transparent" asChild>
                  <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Developer Portal
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">
                2
              </div>
              <div>
                <p className="font-medium">Enable OAuth 2.0</p>
                <p className="text-sm text-muted-foreground">Go to Authentication settings → OAuth 2.0 → Set up</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">
                3
              </div>
              <div>
                <p className="font-medium">Add Callback URL</p>
                <div className="mt-2 p-2 bg-muted rounded text-sm font-mono flex items-center justify-between">
                  <span>http://localhost:3000/api/auth/callback/twitter</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("http://localhost:3000/api/auth/callback/twitter", "callback")}
                  >
                    {copied === "callback" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">
                4
              </div>
              <div>
                <p className="font-medium">Enable Required Scopes</p>
                <div className="mt-2 space-y-1">
                  {["tweet.read", "users.read", "bookmark.read", "offline.access"].map((scope) => (
                    <Badge key={scope} variant="secondary" className="mr-2">
                      {scope}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">
                5
              </div>
              <div>
                <p className="font-medium">Copy OAuth 2.0 Credentials</p>
                <p className="text-sm text-muted-foreground">
                  Get your Client ID and Client Secret (not API Key and Secret)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">
                6
              </div>
              <div>
                <p className="font-medium">Add to Environment Variables</p>
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <div className="space-y-2 text-sm font-mono">
                    <div className="flex items-center justify-between">
                      <span>TWITTER_CLIENT_ID="your-client-id"</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard('TWITTER_CLIENT_ID="your-client-id"', "clientId")}
                      >
                        {copied === "clientId" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>TWITTER_CLIENT_SECRET="your-client-secret"</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard('TWITTER_CLIENT_SECRET="your-client-secret"', "clientSecret")}
                      >
                        {copied === "clientSecret" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Why OAuth 2.0?</strong> It's more secure, supports refresh tokens, has better scope control, and is
          recommended by X.com for new applications.
        </AlertDescription>
      </Alert>
    </div>
  )
}
