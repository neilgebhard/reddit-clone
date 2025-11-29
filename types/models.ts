/**
 * Core data models for the Reddit Clone application
 * All types are derived from the database schema
 */

import { Database } from '@/schema'

// Base types from database schema
export type User = Database['public']['Tables']['profiles']['Row']
export type Subreddit = Database['public']['Tables']['subreddits']['Row']
export type PostVote = Database['public']['Tables']['post_votes']['Row']

// Comment with optional user relation
export type Comment = Database['public']['Tables']['comments']['Row'] & {
  user?: User
}

// Post with all relations
export type Post = Database['public']['Tables']['posts']['Row'] & {
  user: User
  subreddit: Subreddit
  post_votes: PostVote[]
  comments: Comment[]
}

// Post with calculated upvotes
export type PostWithUpvotes = Post & {
  upvotes: number
}

// Props interfaces for components
export interface PostProps {
  id: number
  user: User
  title: string
  subreddit: Subreddit
  comments: Comment[]
  created_at: string | null
  post_votes: PostVote[]
  url?: string | null
  text?: string | null
  image_url?: string | null
}
