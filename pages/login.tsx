import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Link from 'next/link'
// import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()
  const supabaseClient = useSupabaseClient()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const email = e.target.elements.email.value
    const password = e.target.elements.password.value

    let { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })

    console.log(data, error)

    router.push('/')
  }

  return (
    <div className='mt-10'>
      <div className='max-w-md mx-auto bg-white p-12 rounded-2xl'>
        <h2 className='text-xl font-semibold mb-5'>Log In</h2>
        <form onSubmit={handleSubmit}>
          <label
            className='font-semibold uppercase text-sm text-neutral-600'
            htmlFor='email'
          >
            Email
          </label>
          <input
            className='block border rounded-full w-full border-neutral-300 text-xl px-5 py-1 mb-5'
            id='email'
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
