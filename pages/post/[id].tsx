import { supabase } from '@/lib/supabaseClient'
import { formatTimeAgo } from '../..'
import { useSession } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Upvotes from '@/components/Upvotes'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'

export const getServerSideProps = async (context) => {
  const { id } = context.query

  let { data, error } = await supabase
    .from('posts')
    .select(
      '*, post_votes(*), user:posted_by(*), comments(*, user:user_id(*)), subreddit(*)'
    )
    .eq('id', id)
    .single()

  if (error) console.error(error)

  return {
    props: { data },
  }
}

export default function Post({ data }) {
  const [post, setPost] = useState(data)
  const session = useSession()
  const router = useRouter()
  const { id } = router.query
  const supabaseClient = useSupabaseClient()

  const {
    id: postId,
    post_votes,
    user,
    title,
    text,
    created_at,
    comments,
    subreddit,
    image_url,
  } = post
  const relativeTime = formatTimeAgo(created_at)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!session) throw new Error('User is not signed in.')

    const user_id = session.user.id
    const text = e.target.elements.text.value

    if (!text) return

    const { error } = await supabase.from('comments').insert([
      {
        user_id,
        post_id: post.id,
        text,
        updated_at: new Date().toISOString(),
      },
    ])

    if (error) throw error

    e.target.elements.text.value = ''

    let { data } = await supabase
      .from('posts')
      .select(
        '*, post_votes(*), user:posted_by(*), comments(*, user:user_id(*)), subreddit(*)'
      )
      .eq('id', id)
      .single()

    setPost(data)
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this post?')) {
      supabaseClient
        .from('posts')
        .delete()
        .eq('id', id)
        .then(() => router.push('/'))
    }
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name='description'
          content={`The page for the post with title ${title}`}
        />
      </Head>
      <main className='px-3'>
        <div className='max-w-2xl mx-auto mt-5'>
          <article className='flex bg-white rounded-md mb-1 border border-neutral-300 overflow-hidden'>
            <Upvotes id={postId} votes={post_votes} />
            <div className='p-3 grow'>
              <div className='flex text-sm gap-2'>
                <div className='font-semibold hover:underline'>
                  r/{subreddit.name}
                </div>
                <div className='text-neutral-500 font-extralight'>
                  Posted by{' '}
                  <Link
                    className='hover:underline'
                    href={`/user/${user.username}`}
                  >
                    u/{user.username}
                  </Link>{' '}
                  {relativeTime}
                </div>
              </div>
              <h2 className='text-xl font-semibold my-1'>{title}</h2>
              <div>{text}</div>
              {image_url && (
                <div className='mt-3'>
                  <Image
                    src={image_url}
                    width={500}
                    height={500}
                    alt='post image'
                  />
                </div>
              )}
              <form className='mt-8' onSubmit={handleSubmit}>
                <label className='text-sm font-light' htmlFor='text'>
                  Write a comment
                </label>
                <textarea
                  id='text'
                  className='inline-block border w-full rounded px-2 py-1 placeholder:font-light'
                  placeholder='What are your thoughts?'
                  rows={4}
                />
                <div className='flex justify-between'>
                  {session?.user.id === user.id && (
                    <button
                      className='text-red-800 hover:border-neutral-600 font-semibold hover:underline'
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                  )}
                  <button
                    className={`rounded-full bg-neutral-600 hover:bg-neutral-500 text-neutral-100 px-4 py-1 disabled:cursor-not-allowed disabled:opacity-50`}
                    disabled={!session}
                  >
                    Comment
                  </button>
                </div>
              </form>
            </div>
          </article>
          <ul className='mt-5 space-y-1'>
            {comments.map((comment) => {
              return <Comment key={comment.id} {...comment} />
            })}
          </ul>
        </div>
      </main>
    </>
  )
}

function Comment({ id, updated_at, user, text }) {
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
    <li className='space-y-1 py-3 rounded'>
      <div className='text-sm'>
        <span className='font-semibold'>{user.username}</span>{' '}
        <span className='text-neutral-500'>{formatTimeAgo(updated_at)}</span>
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
