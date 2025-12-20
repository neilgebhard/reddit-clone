import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import Link from 'next/link'
import { FaRegComment } from 'react-icons/fa'
import { formatTimeAgo } from '@/index'
import { ROUTES } from '@/constants/routes'
import { Comment as CommentType, Post, User } from '@/types/models'

interface CommentProps {
  id: number
  updated_at: string | null
  user?: User | null
  text: string | null
  post?: Post // Optional: if provided, shows post context
}

export default function Comment({ id, updated_at, user, text, post }: CommentProps) {
  const session = useSession()
  const supabaseClient = useSupabaseClient()

  if (!user) return null

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this comment?')) {
      const { error } = await supabaseClient
        .from('comments')
        .delete()
        .eq('id', id)
      if (error) throw error
      window.location.reload()
    }
  }

  // Render with post context (for user profile page)
  if (post) {
    return (
      <li className='space-y-1 bg-white p-5 rounded border border-neutral-300'>
        <div className='text-neutral-400 text-sm mb-2'>
          <FaRegComment className='text-lg inline mr-1' />{' '}
          <Link
            className='text-blue-400 hover:underline'
            href={ROUTES.USER(user.username ?? '')}
          >
            {user.username}
          </Link>{' '}
          commented on{' '}
          <Link
            href={ROUTES.POST(post.id)}
            className='text-neutral-800 hover:underline'
          >
            {post.title}
          </Link>{' '}
          •{' '}
          <Link
            className='hover:underline text-neutral-700 font-semibold'
            href={ROUTES.SUBREDDIT(post.subreddit.name)}
          >
            r/{post.subreddit.name}
          </Link>
        </div>
        <div className='border my-4' />
        <div className='text-sm mt-2'>
          <span>{user.username}</span>
          <span className='text-neutral-400'> • {formatTimeAgo(updated_at ?? new Date().toISOString())}</span>
        </div>
        <div>{text}</div>
        <div className='flex justify-between'>
          {session?.user.id === user.id && (
            <button
              className='text-red-500 font-semibold text-sm hover:underline'
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
        </div>
      </li>
    )
  }

  // Render simple version (for post detail page)
  return (
    <li className='space-y-1 py-3 rounded'>
      <div className='text-sm'>
        <span className='font-semibold'>{user.username}</span>{' '}
        <span className='text-neutral-500'>{formatTimeAgo(updated_at ?? new Date().toISOString())}</span>
      </div>
      <div>{text}</div>
      <div className='flex justify-between'>
        {session?.user.id === user.id && (
          <button
            className='text-red-700 font-semibold text-sm hover:underline'
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
      </div>
    </li>
  )
}
