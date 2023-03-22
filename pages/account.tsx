import { supabase } from '@/lib/supabaseClient'
import { useSession } from '@supabase/auth-helpers-react'

export const getServerSideProps = async () => {
  let { data: posts } = await supabase.from('posts').select(`
      *, profiles(*)
    `)

  return {
    props: { posts },
  }
}

export default function CreatePost() {
  const session = useSession()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (session) {
      const posted_by = session.user.id
      const title = e.target.elements.title.value
      const text = e.target.elements.text.value
      const { data, error } = await supabase
        .from('posts')
        .insert([{ posted_by, title, text }])
    }
    // TODO: route to the post
  }

  return (
    <div className='max-w-2xl mx-auto mt-10'>
      <h1 className='text-xl mb-3'>Account</h1>
      <div className='bg-white rounded p-5'>
        <form onSubmit={handleSubmit}>
          <div className='mb-5'>
            <label
              className='uppercase text-sm font-semibold'
              htmlFor='username'
            >
              Username
            </label>
            <input
              id='username'
              className='block border w-full rounded px-2 py-1'
              type='text'
            />
          </div>
          <div className='text-right'>
            <button className='rounded-full bg-neutral-600 hover:bg-neutral-500 text-neutral-100 px-4 py-1'>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
