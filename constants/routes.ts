/**
 * Application route constants
 * Use these constants instead of hard-coded strings for type safety and easier refactoring
 */

export const ROUTES = {
  // Static routes
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  ACCOUNT: '/account',
  CREATE_POST: '/create-post',

  // Create post with query params
  CREATE_POST_IMAGE: '/create-post?type=image',
  CREATE_POST_LINK: '/create-post?type=link',
  CREATE_POST_TEXT: '/create-post?type=text',

  // Dynamic routes (functions)
  POST: (id: number | string) => `/post/${id}`,
  SUBREDDIT: (name: string) => `/r/${name}`,
  USER: (username: string) => `/user/${username}`,
} as const

// Type helper for route parameters
export type RouteParams = {
  postId: number | string
  subredditName: string
  username: string
}
