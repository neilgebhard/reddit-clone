import { render, screen } from '@testing-library/react'
import Post from '../components/Post'
import { User, Subreddit, Comment, PostVote, PostProps } from '../types/models'

// Mock the Upvotes component
jest.mock('../components/Upvotes', () => {
  return function MockUpvotes({
    id,
    votes,
  }: {
    id: number
    votes: PostVote[]
  }) {
    return <div data-testid='upvotes-mock'>Upvotes: {votes.length}</div>
  }
})

// Mock the formatTimeAgo function
jest.mock('../index', () => ({
  formatTimeAgo: jest.fn(() => '2 hours ago'),
}))

describe('Post Component', () => {
  const mockUser: User = {
    id: 'user-123',
    username: 'testuser',
  }

  const mockSubreddit: Subreddit = {
    id: 1,
    name: 'technology',
  }

  const mockComments: Comment[] = [
    {
      id: 1,
      text: 'Comment 1',
      created_at: '2024-01-15T10:00:00Z',
      user_id: 'user-1',
      post_id: 123,
    },
    {
      id: 2,
      text: 'Comment 2',
      created_at: '2024-01-15T10:00:00Z',
      user_id: 'user-2',
      post_id: 123,
    },
  ]

  const mockPostVotes: PostVote[] = [
    { id: 1, is_upvote: true, post_id: 123, user_id: 'user-1' },
    { id: 2, is_upvote: false, post_id: 123, user_id: 'user-2' },
  ]

  const defaultProps: PostProps = {
    id: 123,
    user: mockUser,
    title: 'Test Post Title',
    subreddit: mockSubreddit,
    comments: mockComments,
    created_at: '2024-01-15T10:00:00Z',
    post_votes: mockPostVotes,
    url: null,
  }

  it('should render the post with basic information', () => {
    render(<Post {...defaultProps} />)

    expect(screen.getByText('Test Post Title')).toBeInTheDocument()
    expect(screen.getByText('r/technology')).toBeInTheDocument()
    expect(screen.getByText('u/testuser')).toBeInTheDocument()
    expect(screen.getByText('2 comments')).toBeInTheDocument()
  })

  it('should link to the post detail page when no external URL is provided', () => {
    render(<Post {...defaultProps} />)

    const titleLink = screen.getByText('Test Post Title').closest('a')
    expect(titleLink).toHaveAttribute('href', '/post/123')
  })

  it('should link to external URL when provided', () => {
    const propsWithUrl = {
      ...defaultProps,
      url: 'https://example.com',
    }
    render(<Post {...propsWithUrl} />)

    const titleLink = screen.getByText(/Test Post Title/).closest('a')
    expect(titleLink).toHaveAttribute('href', 'https://example.com')
  })

  it('should display correct comment count', () => {
    const propsWithNoComments: PostProps = {
      ...defaultProps,
      comments: [],
    }
    render(<Post {...propsWithNoComments} />)

    expect(screen.getByText('0 comments')).toBeInTheDocument()
  })
})
