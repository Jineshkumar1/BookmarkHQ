# BookmarkHQ - X.com Bookmark Manager

<p align="center">
  <img src="./public/BookMarkHQ.png" alt="BookMarkHQ Logo" width="180">
</p>

<p align="center">
  <a href="./public/BookmarkHQ-Demo.webm">
    <strong>⬇️ Download Demo Video (WEBM)</strong>
  </a>
</p>


A full-stack web application for managing and organizing your X.com (formerly Twitter) bookmarks with intelligent caching and modern UI.

## Features

- 🔐 **OAuth 2.0 Authentication** with X.com
- 📚 **Smart Caching** with Supabase to reduce API calls
- 🎨 **Modern UI** built with Tailwind CSS and shadcn/ui
- 📱 **Responsive Design** works on all devices
- 🔍 **Advanced Filtering** by categories and tags
- 📊 **Analytics Dashboard** with bookmark statistics
- ⚡ **Fast Performance** with server-side caching
- 🔄 **Real-time Sync** with X.com API
- 🛡️ **Rate Limit Protection** with intelligent request management
- 🧪 **Comprehensive Mock API** for development and testing

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: NextAuth.js with OAuth 2.0 PKCE
- **Database**: Supabase (PostgreSQL) for caching
- **API**: X.com API v2
- **Deployment**: Vercel-ready

## Quick Start

### Prerequisites

1. **X.com Developer Account**
   - Create an app at [developer.x.com](https://developer.x.com)
   - Enable OAuth 2.0 with PKCE
   - Add callback URL: `http://localhost:3000/api/auth/callback/twitter`

2. **Supabase Account** (for caching)
   - Sign up at [supabase.com](https://supabase.com)
   - Create a new project
   - Follow the [Supabase Setup Guide](./SUPABASE_SETUP.md)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BookMarkHQlocal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.template .env.local
   ```
   
   Edit `.env.local` with your credentials:
   ```env
   # NextAuth Configuration
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-key"
   
   # X.com API Configuration
   TWITTER_CLIENT_ID="your-twitter-client-id"
   TWITTER_CLIENT_SECRET="your-twitter-client-secret"
   
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   ```

4. **Set up database schema**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Run the contents of `scripts/supabase-setup.sql`

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Mock API System

For development and testing without hitting X.com rate limits, we provide a comprehensive mock API system that simulates the real X.com API behavior.

### Quick Start with Mock API

1. **Access Mock Dashboard**
   Navigate to `/mock-dashboard` to access the comprehensive testing interface.

2. **Test Features**
   - View realistic bookmark data with various categories
   - Test search functionality
   - Monitor simulated rate limits
   - Test error scenarios

3. **Available Mock Endpoints**
   ```
   GET /api/mock/bookmarks     # Fetch mock bookmarks
   GET /api/mock/user          # Get mock user info
   GET /api/mock/search        # Search mock tweets
   GET /api/mock/tweets/{id}   # Get specific tweet
   GET /api/mock/rate-limits   # Check rate limits
   ```

### Mock Data Features

- **10 Diverse Bookmarks**: Tech, Business, Education, Creative, Health, Lifestyle, Entertainment
- **Realistic Media**: High-quality images from Unsplash with alt text
- **Engagement Metrics**: Likes, retweets, replies, quotes with realistic numbers
- **Error Simulation**: Test rate limits, auth errors, and 404s
- **Pagination Support**: Mock pagination tokens and next/previous tokens

### Development Workflow

1. **Use Mock APIs** during initial development
2. **Test UI Components** with realistic data
3. **Verify Error Handling** with simulated errors
4. **Switch to Real API** when ready for production testing

For detailed information, see the [Mock API Guide](./MOCK_API_GUIDE.md).

## How It Works

### Authentication Flow
1. User clicks "Sign in with X.com"
2. Redirected to X.com OAuth consent screen
3. User authorizes the application
4. Redirected back with authorization code
5. Server exchanges code for access token
6. User is authenticated and can access bookmarks

### Caching System
1. **First Request**: Fetches bookmarks from X.com API and stores in Supabase
2. **Subsequent Requests**: Serves bookmarks from cache if less than 1 hour old
3. **Force Refresh**: "Sync from X.com" button bypasses cache
4. **Cache Management**: Cache Status component shows cache info and controls

### API Rate Limiting
- Intelligent request throttling to respect X.com API limits
- Automatic retry with exponential backoff
- User-friendly error messages for rate limit exceeded

## Project Structure

```
BookMarkHQlocal/
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth.js routes
│   │   ├── bookmarks/     # Bookmarks API
│   │   ├── cache/         # Cache management API
│   │   └── mock/          # Mock API endpoints
│   ├── dashboard/         # Main dashboard page
│   ├── mock-dashboard/    # Mock API testing interface
│   └── auth/              # Authentication pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── bookmark-card.tsx # Individual bookmark display
│   ├── cache-status.tsx  # Cache management UI
│   └── ...
├── lib/                  # Utility libraries
│   ├── auth.ts          # NextAuth.js configuration
│   ├── supabase.ts      # Supabase client and helpers
│   ├── x-api.ts         # X.com API integration
│   └── mock-auth.ts     # Mock API client and data
├── scripts/             # Database setup scripts
└── types/               # TypeScript type definitions
```

## API Endpoints

### Authentication
- `GET /api/auth/signin` - Sign in page
- `GET /api/auth/signout` - Sign out
- `GET /api/auth/callback/twitter` - OAuth callback

### Bookmarks
- `GET /api/bookmarks` - Fetch user bookmarks
- `POST /api/bookmarks` - Add bookmark
- `DELETE /api/bookmarks` - Remove bookmark

### Cache Management
- `GET /api/cache` - Get cache status
- `DELETE /api/cache` - Clear cache
- `POST /api/cache` - Refresh cache

### Mock APIs (Development)
- `GET /api/mock/bookmarks` - Fetch mock bookmarks
- `GET /api/mock/user` - Get mock user info
- `GET /api/mock/search` - Search mock tweets
- `GET /api/mock/tweets/{id}` - Get specific mock tweet
- `GET /api/mock/rate-limits` - Check mock rate limits

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXTAUTH_URL` | Your application URL | Yes |
| `NEXTAUTH_SECRET` | NextAuth.js secret key | Yes |
| `TWITTER_CLIENT_ID` | X.com app client ID | Yes |
| `TWITTER_CLIENT_SECRET` | X.com app client secret | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |

### X.com App Configuration

Required scopes:
- `tweet.read` - Read tweets
- `users.read` - Read user information
- `bookmark.read` - Read bookmarks
- `offline.access` - Refresh tokens

Callback URLs:
- Development: `http://localhost:3000/api/auth/callback/twitter`
- Production: `https://yourdomain.com/api/auth/callback/twitter`

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Development Tips

1. **Use Mock APIs First**: Start with the mock system to develop UI and test features
2. **Test Error Scenarios**: Use mock error endpoints to test error handling
3. **Monitor Rate Limits**: Use the mock dashboard to understand rate limit behavior
4. **Switch Gradually**: Move from mock to real APIs when ready

### Database Schema

The application uses two main tables:

1. **bookmarks_cache** - Stores cached bookmark data
   - `user_id` - X.com user ID
   - `data` - JSON containing bookmarks and metadata
   - `last_synced_at` - Timestamp of last sync

2. **sync_logs** - Tracks synchronization operations
   - `user_id` - X.com user ID
   - `sync_type` - Type of sync (manual/scheduled/auto)
   - `status` - Success/error/partial
   - `bookmarks_added` - Number of bookmarks added
   - `error_message` - Error details if failed

## Troubleshooting

### Common Issues

1. **Rate Limit Errors**
   - Use the mock API system for development
   - Implement proper error handling
   - Monitor rate limit headers

2. **Authentication Issues**
   - Verify OAuth callback URLs
   - Check environment variables
   - Ensure proper scopes are enabled

3. **Cache Problems**
   - Clear cache manually if needed
   - Check Supabase connection
   - Verify database schema

### Getting Help

- Check the [Troubleshooting Guide](./TROUBLESHOOTING.md)
- Review the [Mock API Guide](./MOCK_API_GUIDE.md)
- Check console logs for detailed error information
- Use the mock dashboard to test features without rate limits

## Contributing

1. Fork the repository
2. Create a feature branch
3. Use the mock API system for development
4. Test thoroughly with both mock and real APIs
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

- Check the [Troubleshooting Guide](./TROUBLESHOOTING.md)
- Review the [Supabase Setup Guide](./SUPABASE_SETUP.md)
- Open an issue for bugs or feature requests

## Roadmap

- [ ] Advanced bookmark organization
- [ ] Export/import functionality
- [ ] Collaborative bookmark sharing
- [ ] Mobile app
- [ ] Browser extension
- [ ] Advanced analytics
- [ ] AI-powered categorization
