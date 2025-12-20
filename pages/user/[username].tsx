import Head from 'next/head'
import { supabase } from '@/lib/supabaseClient'
import { POST_FIELDS } from '@/lib/supabaseQueries'
import { useRouter } from 'next/router'
import Post from '@/components/Post'
import Comment from '@/components/Comment'
import { formatTimeAgo } from '@/index'
import Link from 'next/link'
import { ROUTES } from '@/constants/routes'
import { GetServerSidePropsContext } from 'next'
import { Post as PostType, Comment as CommentType, User as UserType } from '@/types/models'

type CommentWithPost = CommentType & {
  post: PostType
}

type Profile = UserType & {
  posts: PostType[]
  comments: CommentWithPost[]
}

interface UserPageProps {
  profile: Profile
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { username } = context.query
  const { data: profile, error } = await supabase
    .from('profiles')
    .select(
      `*,
      comments(*, user:user_id(*), post:posts(*, subreddit(*))),
      posts!posts_posted_by_fkey(${POST_FIELDS})`
    )
    .eq('username', username)
    .single()

  return {
    props: { profile },
  }
}

export default function User({ profile }: UserPageProps) {
  const router = useRouter()
  const { posts, comments } = profile

  if (!profile) return null

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
      <main className='px-3 mt-10'>
        <div className='max-w-2xl mx-auto'>
          <div className='text-center'>
            <span className='bg-white inline-block p-5 rounded border border-neutral-300'>
              <div className='text-2xl font-semibold'>{profile.username}</div>
              <div className='text-neutral-500 text-sm'>
                <Link
                  className='hover:underline'
                  href={ROUTES.USER(profile.username ?? '')}
                >
                  u/{profile.username}
                </Link>
                <span> • </span>
                <span>{formatTimeAgo(profile.updated_at ?? new Date().toISOString())}</span>
              </div>
            </span>
          </div>
          <h2 className='text-xl font-semibold mt-5 mb-1'>Posts</h2>
          <PostList posts={posts} />
          <h2 className='text-xl font-semibold mt-5 mb-1'>Comments</h2>
          <CommentList comments={comments} />
        </div>
      </main>
    </>
  )
}

function PostList({ posts }: { posts: PostType[] }) {
  if (posts.length === 0) {
    return (
      <div className='text-center border bg-white rounded p-4 text-neutral-700'>
        This user has no posts yet.
      </div>
    )
  }

  return (
    <ul>
      {posts.map((post: PostType) => {
        return <Post key={post.id} {...post} />
      })}
    </ul>
  )
}

function CommentList({ comments }: { comments: CommentWithPost[] }) {
  if (comments.length === 0) {
    return (
      <div className='text-center border bg-white rounded p-4 text-neutral-700'>
        This user has no comments yet.
      </div>
    )
  }

  return (
    <ul className='space-y-2'>
      {comments.map((comment: CommentWithPost) => {
        return <Comment key={comment.id} {...comment} />
      })}
    </ul>
  )
}
