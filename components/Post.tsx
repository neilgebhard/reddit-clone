import Link from 'next/link'
import { FaRegComment } from 'react-icons/fa'
import { formatTimeAgo } from '..'
import Upvotes from './Upvotes'
import { BiLinkExternal } from 'react-icons/bi'
import { PostProps } from '@/types/models'
import { ROUTES } from '@/constants/routes'

export default function Post({
  id,
  user,
  title,
  subreddit,
  comments,
  created_at,
  post_votes,
  url,
}: PostProps) {
  const relativeTime = formatTimeAgo(new Date(created_at))
  return (
    <li className='flex bg-white rounded-md mb-1 border overflow-hidden'>
      <Upvotes id={id} votes={post_votes} />
      <div className='grow'>
        <div className='p-3 space-y-1 h-full'>
          <div className='flex text-sm gap-2'>
            <Link
              href={ROUTES.SUBREDDIT(subreddit.name)}
              className='font-semibold hover:underline'
            >
              r/{subreddit.name}
            </Link>
            <div className='text-neutral-500 font-extralight'>
              Posted by{' '}
              <Link className='hover:underline' href={ROUTES.USER(user.username)}>
                u/{user.username}
              </Link>{' '}
              {relativeTime}
            </div>
          </div>
          <Link href={url ? url : ROUTES.POST(id)}>
            <h2 className='text-lg font-semibold hover:underline'>
              {title} {url && <BiLinkExternal className='inline' />}
            </h2>
          </Link>
          <Link
            className='inline-flex items-center gap-1 text-neutral-500 font-semibold text-sm hover:underline'
            href={ROUTES.POST(id)}
          >
            <FaRegComment size={15} /> {comments.length} comments
          </Link>
        </div>
      </div>
    </li>
  )
}
