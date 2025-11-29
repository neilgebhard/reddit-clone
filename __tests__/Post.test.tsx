import { render, screen } from '@testing-library/react'
import Post from '../components/Post'
import { User, Subreddit, Comment, PostVote, PostProps } from '../types/models'

// Mock the Upvotes component
jest.mock('../components/Upvotes', () => {
  return function MockUpvotes({ id, votes }: { id: number; votes: PostVote[] }) {
    return <div data-testid="upvotes-mock">Upvotes: {votes.length}</div>
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
    { id: 1, text: 'Comment 1', created_at: '2024-01-15T10:00:00Z', user_id: 'user-1', post_id: 123 },
    { id: 2, text: 'Comment 2', created_at: '2024-01-15T10:00:00Z', user_id: 'user-2', post_id: 123 },
    { id: 3, text: 'Comment 3', created_at: '2024-01-15T10:00:00Z', user_id: 'user-3', post_id: 123 },
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

  it('should render the post with all basic information', () => {
    render(<Post {...defaultProps} />)

    // Check title is rendered
    expect(screen.getByText('Test Post Title')).toBeInTheDocument()

    // Check subreddit link is rendered
    expect(screen.getByText('r/technology')).toBeInTheDocument()

    // Check user link is rendered
    expect(screen.getByText('u/testuser')).toBeInTheDocument()

    // Check relative time is rendered (text is split across elements)
    expect(screen.getByText((content, element) => {
      return element?.textContent === 'Posted by u/testuser 2 hours ago'
    })).toBeInTheDocument()

    // Check comment count is rendered
    expect(screen.getByText('3 comments')).toBeInTheDocument()
  })

  it('should render the Upvotes component with correct props', () => {
    render(<Post {...defaultProps} />)

    const upvotesMock = screen.getByTestId('upvotes-mock')
    expect(upvotesMock).toBeInTheDocument()
    expect(upvotesMock).toHaveTextContent('Upvotes: 2')
  })

  it('should link to the subreddit page', () => {
    render(<Post {...defaultProps} />)

    const subredditLink = screen.getByText('r/technology').closest('a')
    expect(subredditLink).toHaveAttribute('href', '/r/technology')
  })

  it('should link to the user profile page', () => {
    render(<Post {...defaultProps} />)

    const userLink = screen.getByText('u/testuser').closest('a')
    expect(userLink).toHaveAttribute('href', '/user/testuser')
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

  it('should show external link icon when URL is provided', () => {
    const propsWithUrl = {
      ...defaultProps,
      url: 'https://example.com',
    }
    render(<Post {...propsWithUrl} />)

    // The BiLinkExternal icon should be rendered
    const titleElement = screen.getByText(/Test Post Title/).parentElement
    expect(titleElement).toBeInTheDocument()
  })

  it('should link to post comments page', () => {
    render(<Post {...defaultProps} />)

    const commentsLink = screen.getByText('3 comments').closest('a')
    expect(commentsLink).toHaveAttribute('href', '/post/123')
  })

  it('should display "1 comments" for a single comment', () => {
    const propsWithOneComment: PostProps = {
      ...defaultProps,
      comments: [{ id: 1, text: 'Single comment', created_at: '2024-01-15T10:00:00Z', user_id: 'user-1', post_id: 123 }],
    }
    render(<Post {...propsWithOneComment} />)

    expect(screen.getByText('1 comments')).toBeInTheDocument()
  })

  it('should display "0 comments" when there are no comments', () => {
    const propsWithNoComments: PostProps = {
      ...defaultProps,
      comments: [],
    }
    render(<Post {...propsWithNoComments} />)

    expect(screen.getByText('0 comments')).toBeInTheDocument()
  })

  it('should render the post metadata in correct format', () => {
    render(<Post {...defaultProps} />)

    // Check that "Posted by" text is present
    expect(screen.getByText(/Posted by/)).toBeInTheDocument()
  })

  it('should render as a list item', () => {
    const { container } = render(<Post {...defaultProps} />)

    const listItem = container.querySelector('li')
    expect(listItem).toBeInTheDocument()
    expect(listItem).toHaveClass('flex', 'bg-white', 'rounded-md')
  })
})
