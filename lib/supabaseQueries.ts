/**
 * Shared Supabase query select strings
 * Centralizes complex query patterns to avoid duplication
 */

/**
 * Inner post selection fields with all relations:
 * - post_votes
 * - user (posted_by)
 * - comments with user
 * - subreddit
 */
export const POST_FIELDS = '*, post_votes(*), user:posted_by(*), comments(*, user:user_id(*)), subreddit(*)' as const

/**
 * Full post query with all relations (for direct post queries)
 */
export const POST_SELECT_QUERY = POST_FIELDS

/**
 * Nested posts query for use within other queries (e.g., subreddits -> posts)
 */
export const NESTED_POSTS_QUERY = `posts(${POST_FIELDS})`
