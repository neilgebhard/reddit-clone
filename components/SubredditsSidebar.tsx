import Link from 'next/link'

interface Subreddit {
  name: string
}

interface SubredditsSidebarProps {
  subreddits: Subreddit[]
}

export default function SubredditsSidebar({ subreddits }: SubredditsSidebarProps) {
  return (
    <aside>
      <div className='bg-white rounded border border-neutral-300 p-5 hidden sm:block'>
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
