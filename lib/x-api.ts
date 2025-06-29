// X.com API v2 integration following official documentation
// https://docs.x.com/resources/fundamentals/authentication/overview

interface XApiConfig {
  accessToken: string
  refreshToken?: string
}

export class XApiClient {
  private config: XApiConfig
  private baseUrl = "https://api.twitter.com/2"

  constructor(config: XApiConfig) {
    this.config = config
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.config.accessToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`X API Error: ${response.status} - ${error.detail || response.statusText}`)
    }

    return response.json()
  }

  // Get user's bookmarks using X API v2
  async getBookmarks(
    userId: string,
    options: {
      maxResults?: number
      paginationToken?: string
      expansions?: string[]
      tweetFields?: string[]
      userFields?: string[]
    } = {},
  ) {
    const params = new URLSearchParams({
      max_results: (options.maxResults || 10).toString(),
      ...(options.paginationToken && { pagination_token: options.paginationToken }),
      expansions: (options.expansions || ["author_id", "attachments.media_keys", "referenced_tweets.id"]).join(","),
      "tweet.fields": (
        options.tweetFields || [
          "id",
          "text",
          "created_at",
          "public_metrics",
          "context_annotations",
          "entities",
          "attachments",
        ]
      ).join(","),
      "user.fields": (options.userFields || ["id", "name", "username", "profile_image_url", "verified"]).join(","),
      "media.fields": "url,preview_image_url,type,width,height",
    })

    return this.makeRequest(`/users/${userId}/bookmarks?${params}`)
  }

  // Get user information
  async getUser(userId: string) {
    const params = new URLSearchParams({
      "user.fields": "id,name,username,profile_image_url,public_metrics,verified,description,created_at",
    })

    return this.makeRequest(`/users/${userId}?${params}`)
  }

  // Get current authenticated user
  async getMe() {
    const params = new URLSearchParams({
      "user.fields": "id,name,username,profile_image_url,public_metrics,verified,description,created_at",
    })

    return this.makeRequest(`/users/me?${params}`)
  }

  // Add a bookmark (requires write permissions)
  async addBookmark(userId: string, tweetId: string) {
    return this.makeRequest(`/users/${userId}/bookmarks`, {
      method: "POST",
      body: JSON.stringify({ tweet_id: tweetId }),
    })
  }

  // Remove a bookmark (requires write permissions)
  async removeBookmark(userId: string, tweetId: string) {
    return this.makeRequest(`/users/${userId}/bookmarks/${tweetId}`, {
      method: "DELETE",
    })
  }

  // Refresh access token using refresh token
  async refreshAccessToken() {
    if (!this.config.refreshToken) {
      throw new Error("No refresh token available")
    }

    const response = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: this.config.refreshToken,
        client_id: process.env.TWITTER_CLIENT_ID!,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to refresh access token")
    }

    const data = await response.json()
    this.config.accessToken = data.access_token
    this.config.refreshToken = data.refresh_token

    return data
  }
}

// Helper function to create API client from session
export function createXApiClient(session: any): XApiClient {
  if (!session?.accessToken) {
    throw new Error("No access token available in session")
  }

  return new XApiClient({
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
  })
}

// Process bookmark data from X API response
export function processBookmarkData(apiResponse: any) {
  const { data: tweets = [], includes = {} } = apiResponse
  const { users = [], media = [] } = includes

  return tweets.map((tweet: any) => {
    const author = users.find((user: any) => user.id === tweet.author_id)
    const tweetMedia =
      tweet.attachments?.media_keys
        ?.map((key: string) => media.find((m: any) => m.media_key === key))
        .filter(Boolean) || []

    return {
      id: tweet.id,
      text: tweet.text,
      author: {
        id: author?.id,
        name: author?.name || "Unknown",
        username: author?.username || "unknown",
        avatar: author?.profile_image_url || "/placeholder.svg?height=40&width=40",
        verified: author?.verified || false,
      },
      createdAt: tweet.created_at,
      bookmarkedAt: new Date().toISOString(), // This would come from your database
      metrics: {
        likes: tweet.public_metrics?.like_count || 0,
        retweets: tweet.public_metrics?.retweet_count || 0,
        replies: tweet.public_metrics?.reply_count || 0,
        quotes: tweet.public_metrics?.quote_count || 0,
      },
      media: tweetMedia.map((m: any) => ({
        type: m.type,
        url: m.url || m.preview_image_url,
        width: m.width,
        height: m.height,
      })),
      entities: tweet.entities || {},
      contextAnnotations: tweet.context_annotations || [],
      tags: extractHashtags(tweet.text),
      category: categorizeBookmark(tweet.text, tweet.context_annotations),
    }
  })
}

function extractHashtags(text: string): string[] {
  const hashtags = text.match(/#\w+/g) || []
  return hashtags.map((tag) => tag.slice(1).toLowerCase())
}

function categorizeBookmark(text: string, contextAnnotations: any[] = []): string {
  // Use context annotations from X API for better categorization
  const domains = contextAnnotations.map((annotation) => annotation.domain?.name?.toLowerCase()).filter(Boolean)

  if (domains.includes("technology") || domains.includes("software")) {
    return "Tech"
  } else if (domains.includes("education") || domains.includes("science")) {
    return "Education"
  } else if (domains.includes("business") || domains.includes("finance")) {
    return "Business"
  } else if (domains.includes("sports")) {
    return "Sports"
  } else if (domains.includes("entertainment")) {
    return "Entertainment"
  }

  // Fallback to text-based categorization
  const lowerText = text.toLowerCase()
  const techKeywords = ["code", "programming", "api", "development", "tech", "software"]
  const educationKeywords = ["learn", "tutorial", "guide", "education", "study", "course"]
  const businessKeywords = ["startup", "business", "marketing", "sales", "entrepreneur"]

  if (techKeywords.some((keyword) => lowerText.includes(keyword))) {
    return "Tech"
  } else if (educationKeywords.some((keyword) => lowerText.includes(keyword))) {
    return "Education"
  } else if (businessKeywords.some((keyword) => lowerText.includes(keyword))) {
    return "Business"
  }

  return "General"
}
