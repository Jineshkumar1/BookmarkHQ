import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bookmark, Twitter, Zap, Shield } from "lucide-react"
import Link from "next/link"

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Bookmark className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              BookMarkHQ
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            A modern, beautiful bookmark manager for your X.com bookmarks with authentication, 
            dark mode, and advanced organization features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signin">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Twitter className="mr-2 h-5 w-5" />
                Sign in with X.com
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Twitter className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>X.com Integration</CardTitle>
              <CardDescription>
                Seamlessly sync your X.com bookmarks with secure OAuth authentication
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Smart Organization</CardTitle>
              <CardDescription>
                Automatically categorize and tag your bookmarks for easy discovery
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Privacy First</CardTitle>
              <CardDescription>
                Your data stays private and secure with end-to-end encryption
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Ready to organize your bookmarks?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Join thousands of users who have transformed their bookmark management
          </p>
          <Link href="/auth/signin">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 