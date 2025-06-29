# Supabase Setup Guide for BookmarkHQ

This guide will help you set up Supabase as a caching layer for your BookmarkHQ application to reduce API calls to X.com.

## Prerequisites

1. A Supabase account (free tier available at [supabase.com](https://supabase.com))
2. Your BookmarkHQ application running locally
3. X.com Developer account with API access

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `bookmarkhq-cache` (or your preferred name)
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be set up (usually 1-2 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key
   - **service_role** key (keep this secret!)

## Step 3: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Create a new query
3. Copy and paste the contents of `scripts/supabase-setup.sql`
4. Click "Run" to execute the SQL

This will create:
- `bookmarks_cache` table for storing cached bookmark data
- `sync_logs` table for tracking synchronization operations
- Proper indexes for performance
- Row Level Security (RLS) policies

## Step 4: Configure Environment Variables

Create or update your `.env.local` file with the following variables:

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

## Step 5: Install Dependencies

Run the following command to install the Supabase client:

```bash
npm install @supabase/supabase-js
```

## Step 6: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/auth/signin`
3. Sign in with your X.com account
4. Go to the dashboard
5. Check the "Cache Status" component in the sidebar

## Step 7: Verify Database Connection

1. In your Supabase dashboard, go to **Table Editor**
2. You should see the `bookmarks_cache` and `sync_logs` tables
3. After fetching bookmarks, you should see data in these tables

## How Caching Works

### Cache Flow:
1. **First Request**: Fetches bookmarks from X.com API and stores in Supabase
2. **Subsequent Requests**: Serves bookmarks from cache if less than 1 hour old
3. **Force Refresh**: Use "Sync from X.com" button to bypass cache
4. **Cache Management**: Use the Cache Status component to manage cache

### Cache Benefits:
- **Reduced API Calls**: Minimizes X.com API usage
- **Faster Loading**: Cached data loads instantly
- **Rate Limit Protection**: Reduces risk of hitting API limits
- **Offline Capability**: Can show cached data when offline

## Troubleshooting

### Common Issues:

1. **"Missing Supabase environment variables"**
   - Ensure all Supabase environment variables are set in `.env.local`
   - Restart your development server after adding variables

2. **"Permission denied" errors**
   - Check that RLS policies are properly set up
   - Verify your service role key is correct

3. **Cache not updating**
   - Check the cache status component
   - Try clearing the cache manually
   - Verify the database connection

4. **Database connection errors**
   - Verify your Supabase URL and keys
   - Check if your Supabase project is active
   - Ensure the database schema is properly set up

### Debug Steps:

1. Check the browser console for errors
2. Verify environment variables are loaded:
   ```bash
   echo $NEXT_PUBLIC_SUPABASE_URL
   ```
3. Test database connection in Supabase dashboard
4. Check the Network tab in browser dev tools for API calls

## Advanced Configuration

### Custom Cache Duration

To change the cache duration (default: 1 hour), modify the `isCacheFresh` function in `lib/supabase.ts`:

```typescript
export function isCacheFresh(lastSyncedAt: string): boolean {
  const now = new Date()
  const lastSynced = new Date(lastSyncedAt)
  const cacheAge = now.getTime() - lastSynced.getTime()
  const cacheDuration = 2 * 60 * 60 * 1000 // 2 hours in milliseconds
  return cacheAge < cacheDuration
}
```

### Automatic Cache Cleanup

To enable automatic cleanup of old cache entries, uncomment the cron job in `scripts/supabase-setup.sql`:

```sql
SELECT cron.schedule('clean-old-cache', '0 2 * * *', 'SELECT clean_old_cache();');
```

Note: This requires the pg_cron extension to be enabled in your Supabase project.

## Security Considerations

1. **Service Role Key**: Keep this secret and never expose it to the client
2. **RLS Policies**: Ensure proper Row Level Security is enabled
3. **Environment Variables**: Use `.env.local` for local development
4. **Production**: Use environment variables in your hosting platform

## Monitoring

Monitor your application's cache performance:

1. **Cache Hit Rate**: Check how often cache is used vs API calls
2. **Sync Logs**: Review sync_logs table for errors
3. **Database Performance**: Monitor query performance in Supabase dashboard
4. **API Usage**: Track X.com API usage to ensure you stay within limits

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the Supabase documentation
3. Check the application logs for detailed error messages
4. Verify all environment variables are correctly set 