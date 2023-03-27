import { supabase } from '@/lib/supabaseClient'
import { formatTimeAgo } from '../../utils'
import { useSession } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Upvotes from '@/components/Upvotes'
import { FaRegComment } from 'react-icons/fa'

export const getServerSideProps = async (context) => {
  const { id } = context.query

  let { data } = await supabase
    .from('posts')
    .select(
      '*, post_votes(*), user:posted_by(*), comments(*, user:user_id(*)), subreddit(*)'
    )
    .eq('id', id)
    .single()

  return {
    props: { data },
  }
}

const Post = ({ data }) => {
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
                Posted by u/{user.username} {relativeTime}
              </div>
            </div>
            <h2 className='text-xl font-semibold my-1'>{title}</h2>
            <div>{text}</div>
            {session && (
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
                <div className='text-right'>
                  <button className='rounded-full bg-neutral-600 hover:bg-neutral-500 text-neutral-100 px-4 py-1'>
                    Comment
                  </button>
                </div>
                {session.user.id === user.id && (
                  <div className='text-right mt-2'>
                    <button
                      className='rounded-full border border-neutral-400 text-red-800 hover:border-neutral-600 px-4 py-1'
                      onClick={handleDelete}
                    >
                      Delete Post
                    </button>
                  </div>
                )}
              </form>
            )}
            <div className='inline-flex items-center gap-1 text-neutral-500 font-semibold text-sm'>
              <FaRegComment size={15} /> {comments.length} comments
            </div>
          </div>
        </article>
        <div className='mt-3 space-y-2'>
          {comments.map((comment) => {
            return <Comment key={comment.id} {...comment} />
          })}
        </div>
      </div>
    </main>
  )
}

export default Post

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
    <div className='space-y-1 bg-white p-5 rounded'>
      <div className='text-sm'>
        <span className='font-semibold'>{user.username}</span>{' '}
        <span className='text-neutral-400'>{formatTimeAgo(updated_at)}</span>
      </div>
      <div>{text}</div>
      <div className='flex justify-between'>
        <div className='text-neutral-500 font-semibold text-sm'>Reply</div>
        {session?.user.id === user.id && (
          <button
            className='text-red-500 font-semibold text-sm hover:underline'
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
}
