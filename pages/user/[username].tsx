import Head from 'next/head'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'
import Post from '@/components/Post'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { formatTimeAgo } from '@/index'
import { FaRegComment } from 'react-icons/fa'
import Link from 'next/link'

// TODO: fetch profile data

export const getServerSideProps = async (context) => {
  const { username } = context.query
  const { data: profile, error } = await supabase
    .from('profiles')
    .select(
      `*, 
      comments(*, user:user_id(*), post:posts(*, subreddit(*))), 
      posts!posts_posted_by_fkey(*, post_votes(*), user:posted_by(*), comments(*, user:user_id(*)), 
      subreddit(*))`
    )
    .eq('username', username)
    .single()

  return {
    props: { profile },
  }
}

export default function User({ profile }) {
  const router = useRouter()
  const { username } = router.query
  const { posts, comments } = profile

  return (
    <>
      <Head>
        <title>User Profile</title>
        <meta
          name='description'
          content={`The profile of ${profile.username}`}
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='px-3 mt-5'>
        <div className='max-w-2xl mx-auto'>
          <h2 className='text-xl font-semibold mt-5'>Posts</h2>
          <ul>
            {posts.map((post, i) => {
              return <Post key={i} {...post} />
            })}
          </ul>
          <h2 className='text-xl font-semibold mt-5'>Comments</h2>
          <ul className='mt-3 space-y-2'>
            {comments.map((comment) => {
              return <Comment key={comment.id} {...comment} />
            })}
          </ul>
          <pre>{JSON.stringify(profile, null, 2)}</pre>
        </div>
      </main>
    </>
  )
}

function Comment({ id, updated_at, user, text, post }) {
  const session = useSession()
  const supabaseClient = useSupabaseClient()

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this comment?')) {
      const { data, error } = await supabaseClient
        .from('comments')
        .delete()
        .eq('id', id)
      if (error) throw error
      window.location.reload()
    }
  }

  return (
    <li className='space-y-1 bg-white p-5 rounded border border-neutral-300'>
      <div className='text-neutral-400 text-s mb-2'>
        <FaRegComment className='text-lg inline mr-1' />{' '}
        <Link
          className='text-blue-400 hover:underline'
          href={`/user/${user.username}`}
        >
          {user.username}
        </Link>{' '}
        commented on{' '}
        <Link
          href={`/post/${post.id}`}
          className='text-neutral-800 hover:underline'
        >
          {post.title}
        </Link>{' '}
        •{' '}
        <Link
          className='hover:underline text-neutral-700 font-semibold'
          href={`/r/${post.subreddit.name}`}
        >
          r/{post.subreddit.name}
        </Link>
      </div>
      <div className='border my-4' />
      <div className='text-s mt-2'>
        <span className='font-semibold'>{user.username}</span>
        <span className='text-neutral-400'> • {formatTimeAgo(updated_at)}</span>
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
