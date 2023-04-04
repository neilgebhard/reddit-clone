import Head from 'next/head'
import { useRouter } from 'next/router'
import { RiMailSendLine } from 'react-icons/ri'

export default function Confirm() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Confirm Email</title>
        <meta
          name='description'
          content='A page to confirm your email after signup'
        />
      </Head>
      <main className='mt-10'>
        <div className='max-w-xl mx-auto bg-white p-10 rounded-2xl text-center'>
          <RiMailSendLine className='text-orange-700 text-6xl mb-5 inline-block' />
          <h1 className='text-xl font-semibold mb-5'>
            Verification link sent!
          </h1>
          <div>
            We emailed a confirmation link to{' '}
            <strong>{router.query.email}</strong>. Check your email for a link
            to sign in and verify your email.
          </div>
        </div>
      </main>
    </>
  )
}
