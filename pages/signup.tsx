import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Head from 'next/head'
import { BeatLoader } from 'react-spinners'
import { ROUTES } from '@/constants/routes'

export default function Signup() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const email = e.target.elements.email.value
    const password = e.target.elements.password.value
    const username = e.target.elements.username.value

    try {
      setLoading(true)
      setError(null)
      let { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      })
      if (error) throw error
      if (data?.user?.identities?.length === 0) {
        setError('User with email already exists')
      } else {
        router.push(`/confirm?email=${email}`)
      }
    } catch (e) {
      if (
        e.message ===
        'duplicate key value violates unique constraint "profiles_username_key"'
      ) {
        setError('Username is already taken')
      } else {
        console.error(e)
        setError(e.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Signup</title>
        <meta name='description' content='Sign up page' />
      </Head>
      <main className='mt-10 px-3'>
        <div className='max-w-md mx-auto bg-white p-4 sm:p-12 rounded-2xl border'>
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
              required
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
              required
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
              required
            />
            <button
              className={`bg-orange-700 text-white w-full rounded-full font-semibold py-3 mt-5 disabled:bg-neutral-400 disabled:cursor-not-allowed`}
              disabled={loading}
            >
              {loading ? <BeatLoader size={10} color='white' /> : 'Sign up'}
            </button>
          </form>
          {error && (
            <div className='text-red-700 font-semibold mt-4'>
              Oops! {error}.
            </div>
          )}
          <div className='mt-5 text-sm text-neutral-600'>
            Have an account?{' '}
            <Link
              className='text-blue-500 underline font-semibold'
              href={ROUTES.LOGIN}
            >
              Log in
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
