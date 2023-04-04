import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Head from 'next/head'

export default function Signup() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const supabaseClient = useSupabaseClient()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const email = e.target.elements.email.value
    const password = e.target.elements.password.value
    const username = e.target.elements.username.value

    setLoading(true)
    let { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    })

    // if(error) {
    //   setErrorMessage(error.message)
    // } else {
    //   if(data?.user?.identities?.length === 0){
    //     setErrorMessage("User with email already exists")
    //   } else {
    //     window.location.href = 'dashboard'
    //   }
    // }

    setLoading(false)

    if (error) {
      console.error(error)
    } else {
      router.push(`/confirm?email=${email}`)
    }
  }

  return (
    <>
      <Head>
        <title>Signup</title>
        <meta name='description' content='Sign up page' />
      </Head>
      <main className='mt-10'>
        <div className='max-w-md mx-auto bg-white p-12 rounded-2xl'>
          <h2 className='text-xl font-semibold mb-5'>Sign Up</h2>
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
              htmlFor='email'
            >
              Email
            </label>
            <input
              className='block border rounded-full w-full border-neutral-300 text-xl px-5 py-1 mb-5'
              id='email'
              type='email'
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
            <button
              className={`bg-orange-700 text-white w-full rounded-full font-semibold py-3 mt-5 disabled:bg-neutral-400 disabled:cursor-not-allowed`}
              disabled={loading}
            >
              Sign Up
            </button>
          </form>
          <div className='mt-5 text-sm text-neutral-600'>
            Have an account?{' '}
            <Link
              className='text-blue-500 underline font-semibold'
              href='/login'
            >
              Log in
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
