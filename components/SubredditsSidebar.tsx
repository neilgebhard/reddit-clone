import Link from 'next/link'
import { Subreddit } from '@/types/models'
import { ROUTES } from '@/constants/routes'

interface SubredditsSidebarProps {
  subreddits: Subreddit[]
}

export default function SubredditsSidebar({ subreddits }: SubredditsSidebarProps) {
  return (
    <aside>
      <div className='bg-white rounded border border-neutral-300 p-5 hidden sm:block'>
        <h2 className='text-xl font-bold mb-3'>Subreddits</h2>
        <ul>
          {subreddits.map((subreddit) => (
            <Link
              className='block hover:underline'
              href={ROUTES.SUBREDDIT(subreddit.name)}
              key={subreddit.id}
            >
              /r/{subreddit.name}
            </Link>
          ))}
        </ul>
      </div>
    </aside>
  )
}
