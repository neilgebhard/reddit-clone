import { supabase } from '@/lib/supabaseClient'
import { useSession } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'

export default function CreatePost() {
  const session = useSession()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (session) {
      const posted_by = session.user.id
      const title = e.target.elements.title.value
      const text = e.target.elements.text.value
      const { data, error } = await supabase
        .from('posts')
        .insert([{ posted_by, title, text }])
        .select()
      if (error) throw error
      router.push(`/post/${data[0].id}`)
    }
  }

  return (
    <div className='max-w-2xl mx-auto mt-10'>
      <h1 className='text-xl mb-3'>Create a post</h1>
      <div className='bg-white rounded p-5'>
        <form onSubmit={handleSubmit}>
          <div className='mb-5'>
            <label className='uppercase text-sm font-semibold' htmlFor='title'>
              Title
            </label>
            <input
              id='title'
              className='block border w-full rounded px-2 py-1'
              type='text'
            />
          </div>
          <div className='mb-5'>
            <label className='uppercase text-sm font-semibold' htmlFor='text'>
              Text
            </label>
            <textarea
              id='text'
              className='block border w-full rounded px-2 py-1'
              placeholder='Text (optional)'
              rows={4}
            />
          </div>
          <div className='text-right'>
            <button className='rounded-full bg-neutral-600 hover:bg-neutral-500 text-neutral-100 px-4 py-1'>
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
