import { supabase } from '@/lib/supabaseClient'
import { TbArrowBigDown, TbArrowBigUp } from 'react-icons/tb'
import { formatTimeAgo } from '../../utils'
import { useSession } from '@supabase/auth-helpers-react'

export const getServerSideProps = async (context) => {
  const { id } = context.query

  let { data: post } = await supabase
    .from('posts')
    .select('*, user:profiles(*), comments(*, user:profiles(*))')
    .eq('id', id)
    .single()

  return {
    props: { post },
  }
}

const Post = ({ post }) => {
  const { upvotes, user, title, created_at, comments } = post
  const relativeTime = formatTimeAgo(created_at)
  const session = useSession()

  console.log(post)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!session) throw new Error('User is not signed in.')
    const user_id = session.user.id
    const text = e.target.elements.text.value
    if (!text) return
    const { data, error } = await supabase.from('comments').insert([
      {
        user_id,
        post_id: post.id,
        text,
        updated_at: new Date().toISOString(),
      },
    ])
    console.log(data, error)
  }

  return (
    <main className='px-3'>
      <div className='max-w-2xl mx-auto mt-5'>
        <article className='flex bg-white rounded-md mb-1 border border-neutral-300 overflow-hidden'>
          <div className='flex flex-col font-bold text-sm bg-neutral-50 p-3'>
            <TbArrowBigUp size={25} />
            <div>{upvotes}</div>
            <TbArrowBigDown size={25} />
          </div>
          <div className='p-3 grow'>
            <div className='flex text-sm gap-2'>
              {/* <div className='font-semibold hover:underline'>r/{subreddit}</div> */}
              <div className='text-neutral-500 font-extralight'>
                Posted by u/{user.username} {relativeTime}
              </div>
            </div>
            <h2 className='text-lg font-semibold'>{title}</h2>
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
              </form>
            )}
            {/* <div className='inline-flex items-center gap-1 text-neutral-500 font-semibold text-sm hover:underline'>
            <GoComment size={15} /> {comments.length} comments
          </div> */}
          </div>
        </article>
        <div className='mt-3'>
          {comments.map((comment) => {
            return <Comment key={comment.id} {...comment} />
          })}
        </div>
      </div>
    </main>
  )
}

function Comment({ id, updated_at, user, text }) {
  return (
    <div className='space-y-1 bg-white p-5 rounded'>
      <div className='text-sm'>
        <span className='font-semibold'>{user.username}</span>{' '}
        <span className='text-neutral-400'>{formatTimeAgo(updated_at)}</span>
      </div>
      <div>{text}</div>
      <div className='text-neutral-500 font-semibold text-sm'>Reply</div>
    </div>
  )
}

export default Post
