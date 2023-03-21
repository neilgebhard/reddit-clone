import Link from 'next/link'
import { BsReddit } from 'react-icons/bs'

export default function Navbar() {
  return (
    <nav className='bg-white shadow-sm px-5 py-2 flex justify-between'>
      <div className='flex gap-2 items-center'>
        <BsReddit className='text-orange-700' size={33} />
        <h1 className='font-semibold text-xl'>reddit</h1>
      </div>
      <Link
        className='inline-flex place-self-center rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold px-10 py-1 cursor-pointer'
        href='/login'
      >
        Log In
      </Link>
    </nav>
  )
}
