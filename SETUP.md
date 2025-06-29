# BookMarkHQ Setup Guide

## 🚀 Quick Start

Follow these steps to get your X.com Bookmark Manager running locally:

### 1. Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```env
# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"

# Twitter/X.com API Configuration
TWITTER_CLIENT_ID="your-twitter-client-id"
TWITTER_CLIENT_SECRET="your-twitter-client-secret"
```

### 2. X.com Developer Account Setup

#### Step 1: Create a Developer Account
1. Go to [developer.twitter.com](https://developer.twitter.com)
2. Sign in with your X.com account
3. Apply for a developer account if you haven't already

#### Step 2: Create a New App
1. In the developer portal, click "Create App"
2. Fill in the app details:
   - **App name**: `BookMarkHQ` (or your preferred name)
   - **App description**: `A bookmark manager for X.com bookmarks`
   - **Website URL**: `http://localhost:3000` (for development)
   - **Callback URLs**: `http://localhost:3000/api/auth/callback/twitter`

#### Step 3: Configure OAuth 2.0 Settings
1. In your app settings, go to "Authentication settings"
2. Enable OAuth 2.0
3. Set the following:
   - **Type of App**: Web App
   - **Callback URL**: `http://localhost:3000/api/auth/callback/twitter`
   - **Website URL**: `http://localhost:3000`

#### Step 4: Set Required Permissions
1. Go to "App permissions"
2. Select "Read and Write" permissions
3. Save the changes

#### Step 5: Get Your API Keys
1. Go to "Keys and tokens"
2. Copy the following:
   - **Client ID** (OAuth 2.0 Client ID)
   - **Client Secret** (OAuth 2.0 Client Secret)

### 3. Update Environment Variables

Replace the placeholder values in your `.env.local` file:

```env
# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-key-here"

# Twitter/X.com API Configuration
TWITTER_CLIENT_ID="your-actual-client-id-from-twitter"
TWITTER_CLIENT_SECRET="your-actual-client-secret-from-twitter"
```

**Important**: Generate a random secret for `NEXTAUTH_SECRET`. You can use:
```bash
openssl rand -base64 32
```

### 4. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 5. Run the Development Server

```bash
npm run dev
# or
pnpm dev
```

### 6. Test the Application

1. Open [http://localhost:3000](http://localhost:3000)
2. Click "Sign in with X.com"
3. Authorize your app
4. You should be redirected to the dashboard

## 🔧 Troubleshooting

### Common Issues

#### 1. "Invalid callback URL" Error
- Make sure your callback URL in X.com app settings exactly matches: `http://localhost:3000/api/auth/callback/twitter`
- Check for extra spaces or typos

#### 2. "Insufficient permissions" Error
- Ensure your X.com app has "Read and Write" permissions
- Make sure you've saved the permission changes

#### 3. "Authentication failed" Error
- Verify your `TWITTER_CLIENT_ID` and `TWITTER_CLIENT_SECRET` are correct
- Check that your `.env.local` file is in the project root

#### 4. "Rate limit exceeded" Error
- X.com has rate limits. Wait 15 minutes before retrying
- Consider implementing rate limiting in your app

### Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXTAUTH_URL` | Your app's base URL | Yes | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Secret key for NextAuth | Yes | `random-32-character-string` |
| `TWITTER_CLIENT_ID` | X.com OAuth Client ID | Yes | `1234567890abcdef` |
| `TWITTER_CLIENT_SECRET` | X.com OAuth Client Secret | Yes | `abcdef1234567890` |

## 🚀 Production Deployment

When deploying to production:

1. Update `NEXTAUTH_URL` to your production domain
2. Update the callback URL in X.com app settings to your production domain
3. Set `NODE_ENV=production` in your environment

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## 📚 API Documentation

The app uses the X.com API v2 to fetch bookmarks. Key endpoints:

- `GET /api/bookmarks` - Fetch user's bookmarks
- `POST /api/bookmarks` - Add a bookmark
- `DELETE /api/bookmarks` - Remove a bookmark

## 🔐 Security Notes

- Never commit your `.env.local` file to version control
- Use strong, random secrets for `NEXTAUTH_SECRET`
- Regularly rotate your X.com API keys
- Monitor your app's API usage to stay within rate limits

## 🆘 Getting Help

If you encounter issues:

1. Check the [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) file
2. Verify your X.com app settings
3. Check the browser console for errors
4. Ensure all environment variables are set correctly 