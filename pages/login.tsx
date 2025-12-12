import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import BeatLoader from 'react-spinners/BeatLoader'
import { ROUTES } from '@/constants/routes'

export default function Login() {
  const router = useRouter()
  const supabaseClient = useSupabaseClient()
  const ref = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ref.current?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget
    const email = form.elements.namedItem('email') as HTMLInputElement
    const password = form.elements.namedItem('password') as HTMLInputElement

    try {
      setLoading(true)
      setError(null)
      let { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })
      if (error) throw error
      router.push(ROUTES.HOME)
    } catch (e) {
      console.error(e)
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError('An unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name='description' content='Log in to your account' />
      </Head>
      <main className='mt-10 px-3'>
        <div className='max-w-md mx-auto bg-white p-4 sm:p-12 rounded-2xl border'>
          <h2 className='text-xl font-semibold mb-5'>Login</h2>
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
              type='email'
              ref={ref}
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
              {loading ? <BeatLoader size={10} color='white' /> : 'Log In'}
            </button>
          </form>
          {error && (
            <div className='text-red-700 font-semibold mt-4'>
              Oops! {error}.
            </div>
          )}
          <div className='mt-5 text-sm text-neutral-600'>
            New to Reddit?{' '}
            <Link
              className='text-blue-500 underline font-semibold'
              href={ROUTES.SIGNUP}
            >
              Sign up
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
