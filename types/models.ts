/**
 * Core data models for the Reddit Clone application
 */

export interface User {
  id: string
  username: string
  created_at?: string
}

export interface Subreddit {
  id: number
  name: string
  created_at?: string
}

export interface PostVote {
  id: number
  post_id: number
  user_id: string
  is_upvote: boolean
  created_at?: string
}

export interface Comment {
  id: number
  text: string
  created_at: string
  updated_at?: string
  user_id: string
  post_id: number
  user?: User
  post?: Post
}

export interface Post {
  id: number
  title: string
  text?: string | null
  image_url?: string | null
  url?: string | null
  created_at: string
  posted_by: string
  subreddit_id?: number
  user: User
  subreddit: Subreddit
  post_votes: PostVote[]
  comments: Comment[]
}

// Props interfaces for components
export interface PostProps {
  id: number
  user: User
  title: string
  subreddit: Subreddit
  comments: Comment[]
  created_at: string
  post_votes: PostVote[]
  url?: string | null
  text?: string | null
  image_url?: string | null
}
