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

// Enhanced mock bookmarks with more realistic content
export const mockBookmarks = [
  {
    id: "mock_tweet_1",
    text: "🚀 Just deployed our new React app to production! The performance improvements are incredible - 40% faster load times and better SEO. Here's what we learned about optimizing Next.js apps... #webdev #react #nextjs",
    author: {
      id: "mock_author_1",
      name: "Sarah Chen",
      username: "sarahchen",
      avatar: "/placeholder-user.jpg",
      verified: true,
    },
    createdAt: "2024-01-15T10:30:00.000Z",
    bookmarkedAt: "2024-01-15T11:00:00.000Z",
    metrics: {
      likes: 1247,
      retweets: 89,
      replies: 23,
      quotes: 12,
    },
    media: [
      {
        type: "photo",
        url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop",
        width: 800,
        height: 600,
        alt_text: "Code editor with React components",
      }
    ],
    tags: ["tech", "react", "nextjs", "webdev"],
    category: "Tech"
  },
  {
    id: "mock_tweet_2",
    text: "📚 Reading 'Atomic Habits' by James Clear and it's completely changing how I think about productivity. The 1% improvement rule is so powerful. Small changes compound into remarkable results over time. Highly recommend! #productivity #books",
    author: {
      id: "mock_author_2",
      name: "Marcus Johnson",
      username: "marcusjohnson",
      avatar: "/placeholder-user.jpg",
      verified: false,
    },
    createdAt: "2024-01-14T15:45:00.000Z",
    bookmarkedAt: "2024-01-14T16:00:00.000Z",
    metrics: {
      likes: 892,
      retweets: 156,
      replies: 34,
      quotes: 28,
    },
    media: [],
    tags: ["productivity", "books", "habits"],
    category: "Education"
  },
  {
    id: "mock_tweet_3",
    text: "💼 Just closed our Series A funding round! $5M to scale our AI-powered customer service platform. Grateful for our amazing team and investors who believe in our vision. The future of customer experience is here! #startup #funding #ai",
    author: {
      id: "mock_author_3",
      name: "Alex Rodriguez",
      username: "alexrodriguez",
      avatar: "/placeholder-user.jpg",
      verified: true,
    },
    createdAt: "2024-01-13T09:15:00.000Z",
    bookmarkedAt: "2024-01-13T09:30:00.000Z",
    metrics: {
      likes: 2341,
      retweets: 445,
      replies: 67,
      quotes: 89,
    },
    media: [
      {
        type: "photo",
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
        width: 1200,
        height: 800,
        alt_text: "Team celebrating funding success",
      }
    ],
    tags: ["startup", "funding", "ai", "business"],
    category: "Business"
  },
  {
    id: "mock_tweet_4",
    text: "🎨 Finally finished my latest digital art piece! Spent 20+ hours on this one. The lighting was particularly challenging but I'm happy with how it turned out. What do you think? #digitalart #art #creative",
    author: {
      id: "mock_author_4",
      name: "Emma Wilson",
      username: "emmawilson",
      avatar: "/placeholder-user.jpg",
      verified: false,
    },
    createdAt: "2024-01-12T14:20:00.000Z",
    bookmarkedAt: "2024-01-12T15:00:00.000Z",
    metrics: {
      likes: 567,
      retweets: 78,
      replies: 45,
      quotes: 23,
    },
    media: [
      {
        type: "photo",
        url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1000&h=1000&fit=crop",
        width: 1000,
        height: 1000,
        alt_text: "Digital artwork featuring fantasy landscape",
      }
    ],
    tags: ["art", "digitalart", "creative"],
    category: "Creative"
  },
  {
    id: "mock_tweet_5",
    text: "🏃‍♂️ Completed my first marathon today! 26.2 miles in 3:42:15. The training was brutal but crossing that finish line was absolutely worth it. Thanks to everyone who supported me along the way! #marathon #running #achievement",
    author: {
      id: "mock_author_5",
      name: "David Kim",
      username: "davidkim",
      avatar: "/placeholder-user.jpg",
      verified: false,
    },
    createdAt: "2024-01-11T08:30:00.000Z",
    bookmarkedAt: "2024-01-11T09:00:00.000Z",
    metrics: {
      likes: 1234,
      retweets: 234,
      replies: 89,
      quotes: 45,
    },
    media: [
      {
        type: "photo",
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&h=600&fit=crop",
        width: 900,
        height: 600,
        alt_text: "Runner crossing marathon finish line",
      }
    ],
    tags: ["marathon", "running", "fitness"],
    category: "Health"
  },
  {
    id: "mock_tweet_6",
    text: "📊 New market analysis: The AI industry is projected to reach $1.5 trillion by 2030. Key growth drivers include automation, machine learning, and natural language processing. Here's my breakdown of the top opportunities... #ai #market #analysis",
    author: {
      id: "mock_author_6",
      name: "Dr. Lisa Park",
      username: "lisapark",
      avatar: "/placeholder-user.jpg",
      verified: true,
    },
    createdAt: "2024-01-10T12:15:00.000Z",
    bookmarkedAt: "2024-01-10T13:00:00.000Z",
    metrics: {
      likes: 1892,
      retweets: 567,
      replies: 123,
      quotes: 234,
    },
    media: [
      {
        type: "photo",
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1100&h=700&fit=crop",
        width: 1100,
        height: 700,
        alt_text: "AI market growth chart",
      }
    ],
    tags: ["ai", "market", "analysis", "business"],
    category: "Business"
  },
  {
    id: "mock_tweet_7",
    text: "🌱 Started my urban garden today! Planted tomatoes, basil, and mint. There's something so therapeutic about growing your own food. Can't wait to see these babies grow! #gardening #urbanfarming #sustainability",
    author: {
      id: "mock_author_7",
      name: "Maria Garcia",
      username: "mariagarcia",
      avatar: "/placeholder-user.jpg",
      verified: false,
    },
    createdAt: "2024-01-09T16:45:00.000Z",
    bookmarkedAt: "2024-01-09T17:00:00.000Z",
    metrics: {
      likes: 456,
      retweets: 67,
      replies: 34,
      quotes: 12,
    },
    media: [
      {
        type: "photo",
        url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop",
        width: 800,
        height: 600,
        alt_text: "Freshly planted urban garden",
      }
    ],
    tags: ["gardening", "urbanfarming", "sustainability"],
    category: "Lifestyle"
  },
  {
    id: "mock_tweet_8",
    text: "🎵 Just released my new single 'Midnight Dreams' on all platforms! This one's been in the works for months and I'm so excited to share it with you all. Link in bio! #music #newrelease #indie",
    author: {
      id: "mock_author_8",
      name: "Jake Thompson",
      username: "jakethompson",
      avatar: "/placeholder-user.jpg",
      verified: true,
    },
    createdAt: "2024-01-08T20:30:00.000Z",
    bookmarkedAt: "2024-01-08T21:00:00.000Z",
    metrics: {
      likes: 2341,
      retweets: 789,
      replies: 234,
      quotes: 156,
    },
    media: [
      {
        type: "photo",
        url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1000&h=1000&fit=crop",
        width: 1000,
        height: 1000,
        alt_text: "Album cover for Midnight Dreams",
      }
    ],
    tags: ["music", "newrelease", "indie"],
    category: "Entertainment"
  },
  {
    id: "mock_tweet_9",
    text: "📚 Just finished 'The Psychology of Money' by Morgan Housel. Incredible insights on how people think about money. The difference between being rich and being wealthy is mindset, not just numbers. Must-read for anyone interested in personal finance! #finance #books",
    author: {
      id: "mock_author_9",
      name: "Rachel Green",
      username: "rachelgreen",
      avatar: "/placeholder-user.jpg",
      verified: false,
    },
    createdAt: "2024-01-07T11:20:00.000Z",
    bookmarkedAt: "2024-01-07T12:00:00.000Z",
    metrics: {
      likes: 678,
      retweets: 123,
      replies: 45,
      quotes: 34,
    },
    media: [],
    tags: ["finance", "books", "psychology"],
    category: "Education"
  },
  {
    id: "mock_tweet_10",
    text: "🚀 Excited to announce that we're hiring! Looking for talented developers to join our remote-first team. We're building the future of e-commerce and need passionate people who love solving complex problems. DM for details! #hiring #remote #tech",
    author: {
      id: "mock_author_10",
      name: "TechCorp Inc",
      username: "techcorp",
      avatar: "/placeholder-user.jpg",
      verified: true,
    },
    createdAt: "2024-01-06T09:00:00.000Z",
    bookmarkedAt: "2024-01-06T10:00:00.000Z",
    metrics: {
      likes: 892,
      retweets: 456,
      replies: 234,
      quotes: 67,
    },
    media: [
      {
        type: "photo",
        url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop",
        width: 1200,
        height: 800,
        alt_text: "Team collaboration in modern office",
      }
    ],
    tags: ["hiring", "remote", "tech", "careers"],
    category: "Business"
  }
]

// Mock API client for testing
export class MockXApiClient {
  async getMe() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    
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
    const paginationToken = options.paginationToken
    const bookmarks = mockBookmarks.slice(0, maxResults)
    
    // Simulate pagination
    let nextToken = undefined
    if (bookmarks.length >= maxResults && !paginationToken) {
      nextToken = "mock_next_token_page_2"
    }
    
    return {
      data: bookmarks.map(bookmark => ({
        id: bookmark.id,
        text: bookmark.text,
        author_id: bookmark.author.id,
        created_at: bookmark.createdAt,
        public_metrics: bookmark.metrics,
        entities: {
          hashtags: bookmark.tags.map(tag => ({ tag })),
          mentions: [],
          urls: []
        },
        context_annotations: [
          {
            domain: {
              id: "10",
              name: "Person Entity",
              description: "Person Entity"
            },
            entity: {
              id: bookmark.author.id,
              name: bookmark.author.name
            }
          }
        ]
      })),
      includes: {
        users: bookmarks.map(bookmark => ({
          id: bookmark.author.id,
          name: bookmark.author.name,
          username: bookmark.author.username,
          profile_image_url: bookmark.author.avatar,
          verified: bookmark.author.verified,
          public_metrics: {
            followers_count: Math.floor(Math.random() * 10000) + 100,
            following_count: Math.floor(Math.random() * 1000) + 50,
            tweet_count: Math.floor(Math.random() * 5000) + 100,
            listed_count: Math.floor(Math.random() * 100) + 5
          }
        })),
        media: bookmarks
          .filter(bookmark => bookmark.media.length > 0)
          .flatMap(bookmark => bookmark.media.map(media => ({
            media_key: `media_${bookmark.id}`,
            type: media.type,
            url: media.url,
            width: media.width,
            height: media.height,
            alt_text: media.alt_text,
            preview_image_url: media.url
          })))
      },
      meta: {
        result_count: bookmarks.length,
        next_token: nextToken,
        previous_token: paginationToken || undefined
      }
    }
  }

  async addBookmark(userId: string, tweetId: string) {
    console.log(`Mock: Adding bookmark ${tweetId} for user ${userId}`)
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return { success: true }
  }

  async removeBookmark(userId: string, tweetId: string) {
    console.log(`Mock: Removing bookmark ${tweetId} for user ${userId}`)
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return { success: true }
  }

  async getTweet(tweetId: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const bookmark = mockBookmarks.find(b => b.id === tweetId)
    if (!bookmark) {
      throw new Error("Tweet not found")
    }
    
    return {
      data: {
        id: bookmark.id,
        text: bookmark.text,
        author_id: bookmark.author.id,
        created_at: bookmark.createdAt,
        public_metrics: bookmark.metrics,
        entities: {
          hashtags: bookmark.tags.map(tag => ({ tag })),
          mentions: [],
          urls: []
        }
      },
      includes: {
        users: [{
          id: bookmark.author.id,
          name: bookmark.author.name,
          username: bookmark.author.username,
          profile_image_url: bookmark.author.avatar,
          verified: bookmark.author.verified
        }],
        media: bookmark.media.map(media => ({
          media_key: `media_${bookmark.id}`,
          type: media.type,
          url: media.url,
          width: media.width,
          height: media.height,
          alt_text: media.alt_text
        }))
      }
    }
  }

  async searchTweets(query: string, options: any = {}) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const filteredBookmarks = mockBookmarks.filter(bookmark => 
      bookmark.text.toLowerCase().includes(query.toLowerCase()) ||
      bookmark.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    )
    
    const maxResults = options.maxResults || 10
    const results = filteredBookmarks.slice(0, maxResults)
    
    return {
      data: results.map(bookmark => ({
        id: bookmark.id,
        text: bookmark.text,
        author_id: bookmark.author.id,
        created_at: bookmark.createdAt,
        public_metrics: bookmark.metrics
      })),
      includes: {
        users: results.map(bookmark => ({
          id: bookmark.author.id,
          name: bookmark.author.name,
          username: bookmark.author.username,
          profile_image_url: bookmark.author.avatar,
          verified: bookmark.author.verified
        }))
      },
      meta: {
        result_count: results.length,
        next_token: results.length >= maxResults ? "mock_search_next_token" : undefined
      }
    }
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