-- Supabase Database Setup for BookmarkHQ
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Bookmarks cache table for each user
CREATE TABLE IF NOT EXISTS bookmarks_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  data jsonb NOT NULL,
  last_synced_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Sync logs table to track synchronization
CREATE TABLE IF NOT EXISTS sync_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  sync_type text NOT NULL CHECK (sync_type IN ('manual', 'scheduled', 'auto')),
  status text NOT NULL CHECK (status IN ('success', 'error', 'partial')),
  bookmarks_added integer DEFAULT 0,
  bookmarks_updated integer DEFAULT 0,
  error_message text,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookmarks_cache_user_id ON bookmarks_cache(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_cache_last_synced ON bookmarks_cache(last_synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_logs_user_id ON sync_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_logs_created_at ON sync_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_logs_status ON sync_logs(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_bookmarks_cache_updated_at 
  BEFORE UPDATE ON bookmarks_cache
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
-- Enable RLS on tables
ALTER TABLE bookmarks_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for bookmarks_cache
CREATE POLICY "Users can view their own cache" ON bookmarks_cache
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own cache" ON bookmarks_cache
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own cache" ON bookmarks_cache
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own cache" ON bookmarks_cache
  FOR DELETE USING (auth.uid()::text = user_id);

-- Create policies for sync_logs
CREATE POLICY "Users can view their own sync logs" ON sync_logs
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own sync logs" ON sync_logs
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Optional: Create a function to clean old cache entries
CREATE OR REPLACE FUNCTION clean_old_cache()
RETURNS void AS $$
BEGIN
  -- Delete cache entries older than 7 days
  DELETE FROM bookmarks_cache 
  WHERE last_synced_at < NOW() - INTERVAL '7 days';
  
  -- Delete sync logs older than 30 days
  DELETE FROM sync_logs 
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a scheduled job to clean old data (requires pg_cron extension)
-- Uncomment if you have pg_cron enabled in your Supabase project
-- SELECT cron.schedule('clean-old-cache', '0 2 * * *', 'SELECT clean_old_cache();');

-- Insert sample data for testing (optional)
-- INSERT INTO bookmarks_cache (user_id, data, last_synced_at) VALUES 
-- ('test_user_123', '{"bookmarks": [], "meta": {"result_count": 0}}', NOW());

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated; 