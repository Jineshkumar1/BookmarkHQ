import type { NextAuthOptions } from "next-auth"
import TwitterProvider from "next-auth/providers/twitter"

export const authOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0", // Use OAuth 2.0 as recommended by X.com
      authorization: {
        url: "https://twitter.com/i/oauth2/authorize",
        params: {
          scope: "tweet.read users.read bookmark.read offline.access",
          code_challenge_method: "S256", // PKCE as recommended
        },
      },
      token: "https://api.twitter.com/2/oauth2/token",
      userinfo: {
        url: "https://api.twitter.com/2/users/me",
        params: {
          "user.fields": "id,name,username,profile_image_url,public_metrics,verified",
        },
        async request({ tokens, provider }) {
          try {
            const response = await fetch(provider.userinfo?.url!, {
              headers: {
                Authorization: `Bearer ${tokens.access_token}`,
              },
            })

            if (response.status === 429) {
              console.error("Rate limit exceeded during userinfo request")
              throw new Error("Rate limit exceeded. Please wait 15 minutes before trying again.")
            }

            if (!response.ok) {
              console.error(`Userinfo request failed: ${response.status} ${response.statusText}`)
              throw new Error(`Failed to fetch user info: ${response.status}`)
            }

            return response.json()
          } catch (error) {
            console.error("Error in userinfo request:", error)
            throw error
          }
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      console.log("JWT Callback:", { 
        hasAccount: !!account, 
        hasProfile: !!profile,
        tokenKeys: Object.keys(token)
      })
      
      if (account && profile) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.username = (profile as any).username
        token.twitterId = (profile as any).id
        token.verified = (profile as any).verified
        token.publicMetrics = (profile as any).public_metrics
      }
      return token
    },
    async session({ session, token }) {
      console.log("Session Callback:", { 
        hasToken: !!token,
        sessionUser: session.user,
        tokenKeys: Object.keys(token)
      })
      
      if (token) {
        session.accessToken = token.accessToken as string
        session.refreshToken = token.refreshToken as string
        session.user.username = token.username as string
        session.user.twitterId = token.twitterId as string
        session.user.verified = token.verified as boolean
        session.user.publicMetrics = token.publicMetrics as any
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log("Sign in successful:", { 
        userId: user.id, 
        provider: account?.provider,
        isNewUser 
      })
    },
    async signOut({ session, token }) {
      console.log("Sign out:", { sessionId: session?.id })
    },
    async error(error) {
      console.error("NextAuth error:", error)
    },
  },
}
