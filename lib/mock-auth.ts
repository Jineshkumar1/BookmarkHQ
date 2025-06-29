// Mock authentication system for testing when X.com rate limits are hit
export const mockUser = {
  id: "mock_user_123",
  name: "Test User",
  username: "testuser",
  email: "test@example.com",
  image: "/placeholder-user.jpg",
  verified: true,
  twitterId: "mock_twitter_123",
  publicMetrics: {
    followers_count: 1000,
    following_count: 500,
    tweet_count: 2500,
    listed_count: 50
  }
}

export const mockSession = {
  user: mockUser,
  accessToken: "mock_access_token_123",
  refreshToken: "mock_refresh_token_123",
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
}

export const mockBookmarks = [
  {
    id: "mock_tweet_1",
    text: "This is a mock bookmark for testing the caching system. It demonstrates how bookmarks would look in the real application.",
    author: {
      id: "mock_author_1",
      name: "John Doe",
      username: "johndoe",
      avatar: "/placeholder-user.jpg",
      verified: true,
    },
    createdAt: "2024-01-15T10:30:00.000Z",
    bookmarkedAt: "2024-01-15T11:00:00.000Z",
    metrics: {
      likes: 150,
      retweets: 25,
      replies: 10,
      quotes: 5,
    },
    media: [
      {
        type: "photo",
        url: "/placeholder.jpg",
        width: 800,
        height: 600,
        alt_text: "Mock image for testing",
      }
    ],
    tags: ["tech", "testing"],
    category: "Tech"
  },
  {
    id: "mock_tweet_2",
    text: "Another mock bookmark to test the filtering and categorization features. This one is categorized as Education.",
    author: {
      id: "mock_author_2",
      name: "Jane Smith",
      username: "janesmith",
      avatar: "/placeholder-user.jpg",
      verified: false,
    },
    createdAt: "2024-01-14T15:45:00.000Z",
    bookmarkedAt: "2024-01-14T16:00:00.000Z",
    metrics: {
      likes: 89,
      retweets: 12,
      replies: 8,
      quotes: 3,
    },
    media: [],
    tags: ["education", "learning"],
    category: "Education"
  },
  {
    id: "mock_tweet_3",
    text: "Testing the business category with this mock bookmark. It includes some business-related content for demonstration.",
    author: {
      id: "mock_author_3",
      name: "Business Expert",
      username: "bizexpert",
      avatar: "/placeholder-user.jpg",
      verified: true,
    },
    createdAt: "2024-01-13T09:15:00.000Z",
    bookmarkedAt: "2024-01-13T09:30:00.000Z",
    metrics: {
      likes: 234,
      retweets: 45,
      replies: 23,
      quotes: 12,
    },
    media: [
      {
        type: "photo",
        url: "/placeholder.jpg",
        width: 1200,
        height: 800,
        alt_text: "Business chart",
      }
    ],
    tags: ["business", "strategy"],
    category: "Business"
  }
]

// Mock API client for testing
export class MockXApiClient {
  async getMe() {
    return {
      data: {
        id: mockUser.twitterId,
        name: mockUser.name,
        username: mockUser.username,
        profile_image_url: mockUser.image,
        verified: mockUser.verified,
        public_metrics: mockUser.publicMetrics
      }
    }
  }

  async getBookmarks(userId: string, options: any = {}) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const maxResults = options.maxResults || 10
    const bookmarks = mockBookmarks.slice(0, maxResults)
    
    return {
      data: bookmarks.map(bookmark => ({
        id: bookmark.id,
        text: bookmark.text,
        author_id: bookmark.author.id,
        created_at: bookmark.createdAt,
        public_metrics: bookmark.metrics,
        entities: {},
        context_annotations: []
      })),
      includes: {
        users: bookmarks.map(bookmark => ({
          id: bookmark.author.id,
          name: bookmark.author.name,
          username: bookmark.author.username,
          profile_image_url: bookmark.author.avatar,
          verified: bookmark.author.verified
        })),
        media: bookmarks
          .filter(bookmark => bookmark.media.length > 0)
          .flatMap(bookmark => bookmark.media.map(media => ({
            media_key: `media_${bookmark.id}`,
            type: media.type,
            url: media.url,
            width: media.width,
            height: media.height,
            alt_text: media.alt_text
          })))
      },
      meta: {
        result_count: bookmarks.length,
        next_token: bookmarks.length >= maxResults ? "mock_next_token" : undefined
      }
    }
  }

  async addBookmark(userId: string, tweetId: string) {
    console.log(`Mock: Adding bookmark ${tweetId} for user ${userId}`)
    return { success: true }
  }

  async removeBookmark(userId: string, tweetId: string) {
    console.log(`Mock: Removing bookmark ${tweetId} for user ${userId}`)
    return { success: true }
  }
}

// Mock Supabase client for testing
export const mockSupabase = {
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        single: async () => ({
          data: null,
          error: null
        })
      })
    }),
    upsert: async (data: any) => ({
      data,
      error: null
    }),
    delete: () => ({
      eq: async () => ({
        error: null
      })
    }),
    insert: async (data: any) => ({
      data,
      error: null
    })
  })
} 