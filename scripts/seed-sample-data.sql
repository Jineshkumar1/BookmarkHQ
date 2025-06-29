-- Insert sample data for development and testing

-- Insert a sample user
INSERT INTO users (twitter_user_id, username, display_name, profile_image_url) 
VALUES ('123456789', 'johndoe', 'John Doe', '/placeholder.svg?height=40&width=40')
ON CONFLICT (twitter_user_id) DO NOTHING;

-- Insert sample categories
INSERT INTO categories (user_id, name, color, description) VALUES
((SELECT id FROM users WHERE twitter_user_id = '123456789'), 'Tech', '#3B82F6', 'Technology and programming related bookmarks'),
((SELECT id FROM users WHERE twitter_user_id = '123456789'), 'Education', '#10B981', 'Learning resources and educational content'),
((SELECT id FROM users WHERE twitter_user_id = '123456789'), 'Business', '#F59E0B', 'Business and entrepreneurship content'),
((SELECT id FROM users WHERE twitter_user_id = '123456789'), 'Lifestyle', '#EF4444', 'Personal development and lifestyle'),
((SELECT id FROM users WHERE twitter_user_id = '123456789'), 'News', '#8B5CF6', 'News and current events')
ON CONFLICT (user_id, name) DO NOTHING;

-- Insert sample tags
INSERT INTO tags (user_id, name, usage_count) VALUES
((SELECT id FROM users WHERE twitter_user_id = '123456789'), 'javascript', 15),
((SELECT id FROM users WHERE twitter_user_id = '123456789'), 'react', 12),
((SELECT id FROM users WHERE twitter_user_id = '123456789'), 'nextjs', 8),
((SELECT id FROM users WHERE twitter_user_id = '123456789'), 'ai', 20),
((SELECT id FROM users WHERE twitter_user_id = '123456789'), 'productivity', 10),
((SELECT id FROM users WHERE twitter_user_id = '123456789'), 'startup', 7),
((SELECT id FROM users WHERE twitter_user_id = '123456789'), 'design', 9),
((SELECT id FROM users WHERE twitter_user_id = '123456789'), 'webdev', 14)
ON CONFLICT (user_id, name) DO NOTHING;

-- Insert sample bookmarks
INSERT INTO bookmarks (
    user_id, tweet_id, tweet_text, author_id, author_username, author_display_name,
    author_profile_image, tweet_created_at, like_count, retweet_count, reply_count,
    category, tags, has_media
) VALUES
(
    (SELECT id FROM users WHERE twitter_user_id = '123456789'),
    '1234567890123456789',
    'Just shipped a new feature that automatically generates API documentation from your code comments. This is going to save developers so much time! 🚀 #webdev #productivity',
    '987654321',
    'sarahbuilds',
    'Sarah Chen',
    '/placeholder.svg?height=40&width=40',
    '2024-01-15 10:30:00',
    234,
    45,
    12,
    'Tech',
    ARRAY['webdev', 'productivity', 'api'],
    true
),
(
    (SELECT id FROM users WHERE twitter_user_id = '123456789'),
    '1234567890123456790',
    'The psychology behind why we procrastinate and 5 evidence-based strategies to overcome it. Thread 🧵 #productivity #psychology',
    '987654322',
    'mindhacker_phd',
    'Dr. Mind Hacker',
    '/placeholder.svg?height=40&width=40',
    '2024-01-14 15:20:00',
    1205,
    234,
    89,
    'Education',
    ARRAY['productivity', 'psychology'],
    false
),
(
    (SELECT id FROM users WHERE twitter_user_id = '123456789'),
    '1234567890123456791',
    'Beautiful sunset from my balcony tonight. Sometimes you need to pause and appreciate the simple moments ✨ #photography #mindfulness',
    '987654323',
    'alexcaptures',
    'Alex Rivera',
    '/placeholder.svg?height=40&width=40',
    '2024-01-13 19:45:00',
    89,
    12,
    5,
    'Lifestyle',
    ARRAY['photography', 'mindfulness'],
    true
)
ON CONFLICT (user_id, tweet_id) DO NOTHING;

-- Insert a sample sync log
INSERT INTO sync_logs (user_id, sync_type, status, bookmarks_added, started_at, completed_at)
VALUES (
    (SELECT id FROM users WHERE twitter_user_id = '123456789'),
    'manual',
    'success',
    3,
    CURRENT_TIMESTAMP - INTERVAL '2 hours',
    CURRENT_TIMESTAMP - INTERVAL '2 hours' + INTERVAL '30 seconds'
);
