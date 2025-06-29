# X.com Bookmark Manager

![X.com Bookmark Manager](./public/BookmarkHQ.png)

A modern, beautiful bookmark manager for your X.com (Twitter) bookmarks with authentication, dark mode, and advanced organization features.

## 🚀 Features

- **Twitter/X.com Authentication**: Secure OAuth login with your X account
- **Modern UI**: Beautiful interface with light/dark mode toggle
- **Smart Organization**: Categories, tags, and advanced filtering
- **Visual Bookmarks**: Screenshot capture and media previews
- **Real-time Sync**: Daily automatic synchronization
- **Export Options**: Download your data in multiple formats

## 🔧 Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in your project root with the following variables:

\`\`\`env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/bookmark_manager"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"

# Twitter/X.com API Configuration
TWITTER_CLIENT_ID="your-twitter-client-id"
TWITTER_CLIENT_SECRET="your-twitter-client-secret"
TWITTER_API_KEY="your-twitter-api-key"
TWITTER_API_SECRET="your-twitter-api-secret"
TWITTER_BEARER_TOKEN="your-twitter-bearer-token"
\`\`\`

### 2. Twitter Developer Setup

1. Go to [developer.twitter.com](https://developer.twitter.com)
2. Create a new app or use existing one
3. Enable OAuth 2.0 with PKCE
4. Add callback URL: `http://localhost:3000/api/auth/callback/twitter`
5. Copy your Client ID and Client Secret to `.env.local`

### 3. Database Setup

#### Option A: Local PostgreSQL
1. Install PostgreSQL locally
2. Create a database named `bookmark_manager`
3. Update `DATABASE_URL` in `.env.local`

#### Option B: Vercel Postgres (Recommended)
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Create a new Postgres database
3. Copy the connection string to `DATABASE_URL`

#### Option C: Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get the database URL from Settings > Database
4. Update `DATABASE_URL` in `.env.local`

### 4. Installation

\`\`\`bash
# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
\`\`\`

### 5. Production Deployment

#### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

#### Environment Variables for Production
- Set `NEXTAUTH_URL` to your production domain
- Update Twitter callback URL to production domain
- Ensure all API keys are properly configured

## 📱 Usage

1. **Sign In**: Click "Sign In" and authenticate with your X.com account
2. **Sync Bookmarks**: Your bookmarks will automatically sync daily
3. **Organize**: Use categories and tags to organize your bookmarks
4. **Search**: Use the search bar to find specific bookmarks
5. **Export**: Download your data anytime from the settings page

## 🔐 Security

- All authentication is handled securely through NextAuth.js
- API keys are stored as environment variables
- User data is encrypted and stored securely
- No passwords are stored - OAuth only

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Authentication**: NextAuth.js with Twitter OAuth
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.
