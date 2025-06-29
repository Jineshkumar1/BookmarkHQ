# Mock API Guide for BookMarkHQ

This guide explains how to use the comprehensive mock API system that simulates the real X.com API for development and testing purposes.

## Overview

The mock API system provides a realistic simulation of the X.com API v2, allowing you to develop and test your BookMarkHQ application without hitting rate limits or requiring real authentication. It includes:

- **Realistic Data**: 10 diverse bookmarks with different categories, media, and engagement metrics
- **Full API Coverage**: Endpoints for bookmarks, user info, search, and rate limits
- **Error Simulation**: Test various error scenarios (rate limits, auth errors, 404s)
- **Realistic Delays**: Simulated API response times
- **Pagination Support**: Mock pagination tokens and next/previous tokens

## Available Endpoints

### 1. Bookmarks API
```
GET /api/mock/bookmarks
POST /api/mock/bookmarks
DELETE /api/mock/bookmarks?tweetId={id}
```

**Query Parameters:**
- `maxResults` (default: 10) - Number of bookmarks to return
- `forceRefresh` (default: false) - Force fresh data instead of cache
- `paginationToken` - For pagination support

**Response:**
```json
{
  "bookmarks": [...],
  "meta": {
    "result_count": 10,
    "next_token": "mock_next_token_page_2"
  },
  "user": {...},
  "rateLimitInfo": {
    "remaining": 847,
    "maxResults": 10,
    "source": "mock-api"
  },
  "cached": false,
  "last_synced_at": "2024-01-15T10:30:00.000Z"
}
```

### 2. User Info API
```
GET /api/mock/user
```

**Response:**
```json
{
  "user": {
    "id": "mock_twitter_123",
    "name": "Test User",
    "username": "testuser",
    "profile_image_url": "/placeholder-user.jpg",
    "verified": true,
    "public_metrics": {
      "followers_count": 1000,
      "following_count": 500,
      "tweet_count": 2500,
      "listed_count": 50
    }
  },
  "rateLimitInfo": {
    "remaining": 900,
    "reset": "2024-01-15T11:45:00.000Z",
    "source": "mock-api"
  }
}
```

### 3. Search API
```
GET /api/mock/search?query={search_term}&maxResults={number}
```

**Query Parameters:**
- `query` (required) - Search term
- `maxResults` (default: 10) - Number of results to return

**Response:**
```json
{
  "tweets": [...],
  "includes": {
    "users": [...]
  },
  "meta": {
    "result_count": 5,
    "next_token": "mock_search_next_token"
  },
  "rateLimitInfo": {
    "remaining": 156,
    "reset": "2024-01-15T11:45:00.000Z",
    "source": "mock-api"
  }
}
```

### 4. Tweet Lookup API
```
GET /api/mock/tweets/{tweet_id}
```

**Response:**
```json
{
  "tweet": {
    "id": "mock_tweet_1",
    "text": "...",
    "author_id": "mock_author_1",
    "created_at": "2024-01-15T10:30:00.000Z",
    "public_metrics": {...},
    "entities": {...}
  },
  "includes": {
    "users": [...],
    "media": [...]
  },
  "rateLimitInfo": {
    "remaining": 267,
    "reset": "2024-01-15T11:45:00.000Z",
    "source": "mock-api"
  }
}
```

### 5. Rate Limits API
```
GET /api/mock/rate-limits
GET /api/mock/rate-limits?simulateError=rate_limit
GET /api/mock/rate-limits?simulateError=auth_error
```

**Normal Response:**
```json
{
  "rateLimits": {
    "bookmarks": {
      "limit": 1000,
      "remaining": 847,
      "reset": "2024-01-15T11:45:00.000Z",
      "window": "15 minutes"
    },
    "user": {...},
    "search": {...},
    "tweets": {...}
  },
  "source": "mock-api",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error Simulation:**
```json
{
  "error": "Rate limit exceeded. Please wait 15 minutes before trying again.",
  "retryAfter": "15 minutes"
}
```

## Mock Data Structure

### Bookmark Categories
- **Tech**: React, Next.js, web development content
- **Business**: Startup funding, market analysis, hiring
- **Education**: Books, productivity, learning
- **Creative**: Digital art, creative projects
- **Health**: Fitness, marathon running
- **Lifestyle**: Gardening, sustainability
- **Entertainment**: Music releases, indie artists

### Media Types
- **Photos**: High-quality images from Unsplash
- **Alt Text**: Descriptive alt text for accessibility
- **Dimensions**: Various aspect ratios and sizes

### Engagement Metrics
- **Realistic Numbers**: Ranging from dozens to thousands
- **Multiple Metrics**: Likes, retweets, replies, quotes
- **Formatted Display**: K/M suffixes for large numbers

## Using the Mock Dashboard

### Access
Navigate to `/mock-dashboard` to access the comprehensive testing interface.

### Features
1. **Stats Overview**: Real-time statistics about your mock data
2. **User Information**: Display mock user profile and metrics
3. **Rate Limits**: Monitor simulated rate limit status
4. **Search Functionality**: Test search with various queries
5. **Bookmark Management**: View, filter, and organize bookmarks
6. **Error Testing**: Test various error scenarios
7. **View Modes**: Grid and list views for bookmarks
8. **Category Filtering**: Filter by content categories

### Testing Scenarios

#### 1. Normal Operation
- Load bookmarks and observe realistic data
- Test pagination with large result sets
- Verify media display and alt text
- Check engagement metrics formatting

#### 2. Error Handling
- Test rate limit errors: `/api/mock/rate-limits?simulateError=rate_limit`
- Test authentication errors: `/api/mock/rate-limits?simulateError=auth_error`
- Test 404 errors: `/api/mock/tweets/nonexistent`

#### 3. Search Functionality
- Search for specific terms: "react", "business", "music"
- Test with different result counts
- Verify search result formatting

#### 4. Performance Testing
- Test with different `maxResults` values
- Observe simulated API delays
- Test cache vs fresh data behavior

## Development Workflow

### 1. Setup
```bash
# Start the development server
npm run dev

# Access mock dashboard
http://localhost:3000/mock-dashboard
```

### 2. Testing
- Use the mock dashboard to test all features
- Verify UI components work correctly
- Test error handling and edge cases
- Validate data formatting and display

### 3. Integration
- Replace real API calls with mock endpoints during development
- Use mock data for UI development and testing
- Test error scenarios without hitting real rate limits

### 4. Switching to Real API
When ready to test with real data:
1. Update environment variables with real credentials
2. Replace mock API calls with real endpoints
3. Test authentication flow
4. Monitor real rate limits

## Mock Data Customization

### Adding New Bookmarks
Edit `lib/mock-auth.ts` to add new mock bookmarks:

```typescript
export const mockBookmarks = [
  // ... existing bookmarks
  {
    id: "mock_tweet_11",
    text: "Your new mock tweet content...",
    author: {
      id: "mock_author_11",
      name: "New Author",
      username: "newauthor",
      avatar: "/placeholder-user.jpg",
      verified: false,
    },
    createdAt: "2024-01-05T12:00:00.000Z",
    bookmarkedAt: "2024-01-05T12:30:00.000Z",
    metrics: {
      likes: 123,
      retweets: 45,
      replies: 12,
      quotes: 8,
    },
    media: [],
    tags: ["custom", "tag"],
    category: "Custom"
  }
]
```

### Modifying API Behavior
Edit the `MockXApiClient` class to change API behavior:

```typescript
async getBookmarks(userId: string, options: any = {}) {
  // Modify delay time
  await new Promise(resolve => setTimeout(resolve, 1000)) // 1 second delay
  
  // Modify response structure
  // ... your custom logic
}
```

## Best Practices

### 1. Development
- Use mock APIs during initial development
- Test all UI components with mock data
- Verify error handling with simulated errors
- Test performance with realistic delays

### 2. Testing
- Create comprehensive test scenarios
- Test edge cases and error conditions
- Validate data formatting and display
- Test responsive design with various content

### 3. Documentation
- Keep mock data realistic and diverse
- Document any custom modifications
- Update this guide when adding new features
- Maintain consistency with real API structure

## Troubleshooting

### Common Issues

1. **Mock data not loading**
   - Check browser console for errors
   - Verify API endpoint URLs
   - Ensure development server is running

2. **Images not displaying**
   - Check image URLs in mock data
   - Verify Unsplash image accessibility
   - Test with placeholder images

3. **Search not working**
   - Verify search query format
   - Check search endpoint response
   - Test with simple queries first

4. **Rate limit errors**
   - Use error simulation endpoints
   - Check error handling in UI
   - Verify error message display

### Debug Tips

1. **Console Logging**: All mock API calls include detailed console logs
2. **Network Tab**: Check network requests in browser dev tools
3. **Mock Dashboard**: Use the comprehensive testing interface
4. **Error Simulation**: Test various error scenarios

## Conclusion

The mock API system provides a robust foundation for developing and testing your BookMarkHQ application. It simulates real-world scenarios while avoiding rate limits and authentication issues. Use it to build a solid foundation before integrating with the real X.com API.

For questions or issues, refer to the console logs and this documentation. The mock system is designed to be easily customizable and extensible for your specific needs. 