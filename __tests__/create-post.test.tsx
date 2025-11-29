import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/router'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import CreatePost from '../pages/create-post'
import { Subreddit } from '@/types/models'

jest.mock('@/lib/supabaseClient', () => ({
  supabase: { from: jest.fn() },
}))

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@supabase/auth-helpers-react', () => ({
  useSession: jest.fn(),
  useSupabaseClient: jest.fn(),
}))

jest.mock('@/components/ImageUpload', () => {
  return function MockImageUpload() {
    return <div>Image Upload</div>
  }
})

describe('CreatePost', () => {
  const mockSubreddits: Subreddit[] = [
    { id: 1, name: 'technology', created_at: null },
  ]

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      query: {},
    })

    ;(useSession as jest.Mock).mockReturnValue({
      user: { id: 'user-123' },
    })

    const mockSelect = jest.fn().mockReturnValue({
      data: [{ id: 1 }],
      error: null,
    })

    ;(useSupabaseClient as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: mockSelect,
        }),
      }),
    })
  })

  it('renders the form', () => {
    render(<CreatePost subreddits={mockSubreddits} />)
    expect(screen.getByText('Create a post')).toBeInTheDocument()
  })

  it('submits a post', async () => {
    const user = userEvent.setup()
    const mockPush = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      query: {},
    })

    render(<CreatePost subreddits={mockSubreddits} />)

    await user.type(screen.getByLabelText(/title/i), 'Test Post')
    await user.click(screen.getByRole('button', { name: /create post/i }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/post/1')
    })
  })
})
