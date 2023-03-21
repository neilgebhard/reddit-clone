import Link from 'next/link'

export default function Login() {
  const handleSubmit = () => {}

  return (
    <div className='mt-10'>
      <div className='max-w-md mx-auto bg-white p-12 rounded-2xl'>
        <h2 className='text-xl font-semibold mb-5'>Log In</h2>
        <form onSubmit={handleSubmit}>
          <label
            className='font-semibold uppercase text-sm text-neutral-600'
            htmlFor='username'
          >
            Username
          </label>
          <input
            className='block border rounded-full w-full border-neutral-300 text-xl px-5 py-1 mb-5'
            id='username'
            type='text'
          />
          <label
            className='font-semibold uppercase text-sm text-neutral-600'
            htmlFor='password'
          >
            Password
          </label>
          <input
            className='block border rounded-full w-full border-neutral-300 text-xl px-5 py-1 mb-5'
            id='password'
            type='password'
          />
          <button className='bg-orange-700 text-white w-full rounded-full font-semibold py-3 mt-5'>
            Log In
          </button>
        </form>
        <div className='mt-5 text-sm text-neutral-600'>
          New to Reddit?{' '}
          <Link
            className='text-blue-500 underline font-semibold'
            href='/signup'
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
