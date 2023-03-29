export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      comments: {
        Row: {
          created_at: string | null
          id: number
          post_id: number
          text: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          post_id: number
          text?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          post_id?: number
          text?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
      }
      post_votes: {
        Row: {
          created_at: string | null
          id: number
          is_upvote: boolean
          post_id: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_upvote: boolean
          post_id: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          is_upvote?: boolean
          post_id?: number
          user_id?: string
        }
      }
      posts: {
        Row: {
          created_at: string | null
          id: number
          image_url: string | null
          posted_by: string | null
          subreddit: number
          text: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          image_url?: string | null
          posted_by?: string | null
          subreddit: number
          text?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          id?: number
          image_url?: string | null
          posted_by?: string | null
          subreddit?: number
          text?: string | null
          title?: string
        }
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
        }
      }
      subreddits: {
        Row: {
          created_at: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

