import Head from 'next/head'
import Link from 'next/link'
import { useSession } from '@supabase/auth-helpers-react'
import { supabase } from '@/lib/supabaseClient'
import Upvotes from '@/components/Upvotes'
import { formatTimeAgo } from '@/index'
import { FaRegComment } from 'react-icons/fa'
import { useRouter } from 'next/router'

export const getServerSideProps = async (context) => {
  const { name } = context.query
  const [posts, subreddits] = await Promise.all([
    supabase
      .from('subreddits')
      .select(
        `
        *, 
        posts(*, 
            post_votes(*),
            user:posted_by(*), 
            comments(*, user:user_id(*)),
            subreddit(*))`
      )
      .eq('name', name),
    supabase.from('subreddits').select('*'),
  ])

  return {
    props: { posts: posts.data, subreddits: subreddits.data },
  }
}

export default function Subreddit({ posts, subreddits }) {
  const session = useSession()
  const router = useRouter()
  const { name } = router.query

  return (
    <>
      <Head>
        <title>{name}</title>
        <meta name='description' content={`The subreddit for ${name}`} />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='px-3 mt-5'>
        <div className='max-w-2xl mx-auto'>
          {session && (
            <Link
              className='inline-block text-blue-600 hover:underline mb-3'
              href='/create-post'
            >
              + Post something
            </Link>
          )}
          <div className='flex gap-2'>
            <div className='max-w-2xl grow'>
              <ul>
                {posts[0].posts.map((post, i) => {
                  return <Post key={i} {...post} />
                })}
              </ul>
            </div>
            <Subreddits subreddits={subreddits} />
          </div>
        </div>
      </main>
    </>
  )
}

function Post({
  id,
  user,
  title,
  subreddit,
  comments,
  created_at,
  post_votes,
}) {
  const relativeTime = formatTimeAgo(new Date(created_at))
  return (
    <li className='flex bg-white rounded-md mb-1 border border-neutral-300 hover:border-neutral-500 cursor-pointer overflow-hidden'>
      <Upvotes id={id} votes={post_votes} />
      <Link className='grow' href={`/post/${id}`}>
        <div className='p-3 space-y-1 h-full'>
          <div className='flex text-sm gap-2'>
            <div className='font-semibold hover:underline'>
              r/{subreddit.name}
            </div>
            <div className='text-neutral-500 font-extralight'>
              Posted by u/{user.username} {relativeTime}
            </div>
          </div>
          <h2 className='text-lg font-semibold'>{title}</h2>
          <div className='inline-flex items-center gap-1 text-neutral-500 font-semibold text-sm hover:underline'>
            <FaRegComment size={15} /> {comments.length} comments
          </div>
        </div>
      </Link>
    </li>
  )
}

function Subreddits({ subreddits }) {
  return (
    <aside>
      <div className='bg-white rounded-md border border-neutral-300 p-5 hidden sm:block'>
        <h2 className='text-xl font-bold mb-3'>Subreddits</h2>
        <ul>
          {subreddits.map(({ name }, i) => (
            <Link className='block hover:underline' href={`/r/${name}`} key={i}>
              /r/{name}
            </Link>
          ))}
        </ul>
      </div>
    </aside>
  )
}