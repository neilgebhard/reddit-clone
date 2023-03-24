import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import { TbArrowBigDown, TbArrowBigUp } from 'react-icons/tb'
import { formatTimeAgo } from '../../utils'

// TODO: Post page
export const getServerSideProps = async (context) => {
  const { id } = context.query

  let { data: post } = await supabase
    .from('posts')
    .select('*, profiles(*)')
    .eq('id', id)
    .single()

  console.log(post)

  return {
    props: { post },
  }
}

const Post = ({ post }) => {
  const { upvotes, profiles, title, created_at } = post
  const relativeTime = formatTimeAgo(new Date(created_at))

  return (
    <main className='px-3'>
      <div className='max-w-4xl mx-auto mt-5'>
        <article className='flex bg-white rounded-md mb-1 border border-neutral-300 hover:border-neutral-500 cursor-pointer overflow-hidden'>
          <div className='flex flex-col font-bold text-sm bg-neutral-50 p-3'>
            <TbArrowBigUp size={25} />
            <div>{upvotes}</div>
            <TbArrowBigDown size={25} />
          </div>
          <div className='p-3 space-y-1'>
            <div className='flex text-sm gap-2'>
              {/* <div className='font-semibold hover:underline'>r/{subreddit}</div> */}
              <div className='text-neutral-500 font-extralight'>
                Posted by u/{profiles.username} {relativeTime}
              </div>
            </div>
            <h2 className='text-lg font-semibold'>{title}</h2>
            {/* <div className='inline-flex items-center gap-1 text-neutral-500 font-semibold text-sm hover:underline'>
            <GoComment size={15} /> {comments.length} comments
          </div> */}
          </div>
        </article>
      </div>
    </main>
  )
}

export default Post
