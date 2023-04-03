import Link from 'next/link'
import { BsReddit } from 'react-icons/bs'
import { useSession } from '@supabase/auth-helpers-react'
import UserDropdown from './UserDropdown'

export default function Navbar() {
  const session = useSession()

  return (
    <nav className='bg-white shadow-sm px-5 py-2 flex justify-between items-center'>
      <Link href='/' className='flex gap-2 items-center'>
        <BsReddit className='text-orange-700' size={33} />
        <div className='font-semibold text-xl'>reddit</div>
      </Link>
      {session ? (
        <UserDropdown />
      ) : (
        <div className='flex gap-2'>
          <Link
            className='inline-flex place-self-center rounded-full border border-neutral-400 hover:border-neutral-500 text-neutral-900 font-semibold px-10 py-1 cursor-pointer'
            href='/login'
          >
            Log In
          </Link>
          <Link
            className='inline-flex place-self-center rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold px-10 py-1 cursor-pointer'
            href='/signup'
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  )
}
