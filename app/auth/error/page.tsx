"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, RefreshCw, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")

  const getErrorInfo = (error: string | null) => {
    switch (error) {
      case "OAuthCallback":
        return {
          title: "Authentication Error",
          description: "There was an issue completing the sign-in process.",
          details: errorDescription || "The OAuth callback failed. This could be due to rate limiting or a temporary issue with X.com.",
          icon: AlertCircle,
          action: "Try Again",
          waitTime: "15 minutes"
        }
      case "OAuthSignin":
        return {
          title: "Sign-in Error",
          description: "Unable to start the sign-in process.",
          details: "There was an issue initiating the OAuth flow with X.com.",
          icon: AlertCircle,
          action: "Try Again",
          waitTime: "5 minutes"
        }
      case "OAuthCreateAccount":
        return {
          title: "Account Creation Error",
          description: "Unable to create your account.",
          details: "There was an issue creating your account during the sign-in process.",
          icon: AlertCircle,
          action: "Try Again",
          waitTime: "5 minutes"
        }
      case "OAuthAccountNotLinked":
        return {
          title: "Account Not Linked",
          description: "This X.com account is not linked to an existing account.",
          details: "Please sign in with the same account you used previously.",
          icon: AlertCircle,
          action: "Sign In Again",
          waitTime: null
        }
      case "EmailSignin":
        return {
          title: "Email Sign-in Error",
          description: "Unable to send sign-in email.",
          details: "There was an issue sending the sign-in email.",
          icon: AlertCircle,
          action: "Try Again",
          waitTime: "5 minutes"
        }
      case "CredentialsSignin":
        return {
          title: "Invalid Credentials",
          description: "The provided credentials are invalid.",
          details: "Please check your username and password and try again.",
          icon: AlertCircle,
          action: "Try Again",
          waitTime: null
        }
      case "SessionRequired":
        return {
          title: "Session Required",
          description: "You must be signed in to access this page.",
          details: "Please sign in to continue.",
          icon: AlertCircle,
          action: "Sign In",
          waitTime: null
        }
      default:
        return {
          title: "Authentication Error",
          description: "An unexpected error occurred during sign-in.",
          details: errorDescription || "Please try again or contact support if the issue persists.",
          icon: AlertCircle,
          action: "Try Again",
          waitTime: "5 minutes"
        }
    }
  }

  const errorInfo = getErrorInfo(error)
  const IconComponent = errorInfo.icon

  const isRateLimitError = errorDescription?.includes("429") || 
                          errorDescription?.includes("rate limit") ||
                          errorDescription?.includes("Too Many Requests")

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <IconComponent className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-xl">{errorInfo.title}</CardTitle>
          <CardDescription>{errorInfo.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            {errorInfo.details}
          </p>

          {isRateLimitError && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                <Clock className="h-4 w-4" />
                <p className="text-sm font-medium">Rate Limit Exceeded</p>
              </div>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                X.com has rate limited your requests. Please wait 15 minutes before trying again.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {errorInfo.waitTime ? (
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2">
                  Please wait {errorInfo.waitTime} before trying again
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  disabled
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Wait {errorInfo.waitTime}
                </Button>
              </div>
            ) : (
              <Button asChild className="w-full">
                <Link href="/auth/signin">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {errorInfo.action}
                </Link>
              </Button>
            )}
            
            <Button variant="ghost" asChild className="w-full">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Error code: {error || "unknown"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 