declare module "next-auth" {
  interface Session {
    accessToken?: string
    refreshToken?: string
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      username?: string
      twitterId?: string
      verified?: boolean
      publicMetrics?: {
        followers_count: number
        following_count: number
        tweet_count: number
        listed_count: number
      }
    }
  }

  interface JWT {
    accessToken?: string
    refreshToken?: string
    username?: string
    twitterId?: string
    verified?: boolean
    publicMetrics?: any
  }
}

declare module "next-auth/providers/twitter" {
  interface TwitterProfile {
    data: {
      id: string
      name: string
      username: string
      profile_image_url?: string
      verified?: boolean
      public_metrics?: {
        followers_count: number
        following_count: number
        tweet_count: number
        listed_count: number
      }
    }
  }
}
