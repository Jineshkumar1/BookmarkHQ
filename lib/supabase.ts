import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

// Server-side Supabase client with service role key for admin operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Client-side Supabase client (if needed for public operations)
export const createClientSupabase = () => {
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase public environment variables')
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Database types for TypeScript
export interface BookmarkCache {
  id: string
  user_id: string
  data: {
    bookmarks: any[]
    meta: any
  }
  last_synced_at: string
}

export interface SyncLog {
  id: number
  user_id: string
  sync_type: 'manual' | 'scheduled' | 'auto'
  status: 'success' | 'error' | 'partial'
  bookmarks_added: number
  bookmarks_updated: number
  error_message?: string
  started_at: string
  completed_at?: string
  created_at: string
}

// Cache management functions
export async function getCachedBookmarks(userId: string): Promise<BookmarkCache | null> {
  const { data, error } = await supabase
    .from('bookmarks_cache')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching cached bookmarks:', error)
    return null
  }

  return data
}

export async function updateBookmarkCache(userId: string, bookmarks: any[], meta: any): Promise<void> {
  const { error } = await supabase
    .from('bookmarks_cache')
    .upsert({
      user_id: userId,
      data: { bookmarks, meta },
      last_synced_at: new Date().toISOString(),
    })

  if (error) {
    console.error('Error updating bookmark cache:', error)
    throw error
  }
}

export async function clearBookmarkCache(userId: string): Promise<void> {
  const { error } = await supabase
    .from('bookmarks_cache')
    .delete()
    .eq('user_id', userId)

  if (error) {
    console.error('Error clearing bookmark cache:', error)
    throw error
  }
}

export async function logSync(userId: string, syncType: SyncLog['sync_type'], status: SyncLog['status'], options: {
  bookmarksAdded?: number
  bookmarksUpdated?: number
  errorMessage?: string
} = {}): Promise<void> {
  const { error } = await supabase
    .from('sync_logs')
    .insert({
      user_id: userId,
      sync_type: syncType,
      status,
      bookmarks_added: options.bookmarksAdded || 0,
      bookmarks_updated: options.bookmarksUpdated || 0,
      error_message: options.errorMessage,
      started_at: new Date().toISOString(),
      completed_at: status !== 'error' ? new Date().toISOString() : null,
    })

  if (error) {
    console.error('Error logging sync:', error)
  }
}

// Check if cache is fresh (within 1 hour)
export function isCacheFresh(lastSyncedAt: string): boolean {
  const now = new Date()
  const lastSynced = new Date(lastSyncedAt)
  const cacheAge = now.getTime() - lastSynced.getTime()
  const oneHour = 60 * 60 * 1000 // 1 hour in milliseconds
  return cacheAge < oneHour
} 