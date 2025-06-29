# Troubleshooting Guide

## Common NextAuth.js Issues

### 1. Middleware Export Error
**Error**: `The "next-auth/middleware" module does not provide an export named "withAuth"`

**Solution**: This occurs with newer versions of NextAuth.js. Use the updated middleware approach:

\`\`\`typescript
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  // Implementation as shown in middleware.ts
}
\`\`\`

### 2. Environment Variables
Make sure these are set in your `.env.local`:

\`\`\`env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
TWITTER_CLIENT_ID="your-client-id"
TWITTER_CLIENT_SECRET="your-client-secret"
\`\`\`

### 3. X.com API Issues

**403 Forbidden**: Check your app scopes in X Developer Portal
**401 Unauthorized**: Re-authenticate or check API credentials
**429 Rate Limited**: Wait 15 minutes before retrying

### 4. Testing the Application

1. Start the development server: `npm run dev`
2. Navigate to `/auth/signin`
3. Sign in with your X.com account
4. Go to `/test` to run API tests
5. Check the console for any errors

### 5. Common Setup Issues

**Missing Scopes**: Ensure your X.com app has:
- `tweet.read`
- `users.read`
- `bookmark.read`
- `offline.access`

**Callback URL**: Must match exactly:
- Development: `http://localhost:3000/api/auth/callback/twitter`
- Production: `https://yourdomain.com/api/auth/callback/twitter`

**OAuth Version**: Use OAuth 2.0, not OAuth 1.0a
