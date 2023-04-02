import { Fragment, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from '@supabase/auth-helpers-react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { supabase } from '@/lib/supabaseClient'
import { Listbox, Transition } from '@headlessui/react'
import { BsChevronExpand, BsCheck2 } from 'react-icons/bs'
import ImageUpload from '@/components/ImageUpload'

export const getServerSideProps = async () => {
  const { data: subreddits } = await supabase.from('subreddits').select('*')
  return {
    props: { subreddits },
  }
}

export default function CreatePost({ subreddits }) {
  const session = useSession()
  const router = useRouter()
  const supabase = useSupabaseClient()
  const [selected, setSelected] = useState(subreddits[0])
  const [imageUrl, setImageUrl] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!session) throw new Error('User not signed in.')

    const posted_by = session.user.id
    const title = e.target.elements.title.value
    const text = e.target.elements.text.value

    const { data, error } = await supabase
      .from('posts')
      .insert([
        { posted_by, title, text, subreddit: selected.id, image_url: imageUrl },
      ])
      .select()

    if (error) throw error

    router.push(`/post/${data[0].id}`)
  }

  const onUpload = (imageUrl) => {
    setImageUrl(process.env.NEXT_PUBLIC_SUPABASE_IMAGE_BUCKET_URL + imageUrl)
  }

  return (
    <div className='max-w-2xl mx-auto mt-10'>
      <h1 className='text-xl mb-3'>Create a post</h1>
      <div className='bg-white rounded p-5'>
        <form onSubmit={handleSubmit}>
          <div className='mb-5'>
            <ListBox
              subreddits={subreddits}
              selected={selected}
              setSelected={setSelected}
            />
          </div>
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
          <ImageUpload onUpload={onUpload} />
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

function ListBox({ subreddits, selected, setSelected }) {
  return (
    <>
      <Listbox value={selected} onChange={setSelected}>
        <div className='relative mt-1'>
          <Listbox.Label className='uppercase text-sm font-semibold block'>
            Choose a community
          </Listbox.Label>
          <Listbox.Button className='relative w-full max-w-xs cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm'>
            <span className='block truncate'>{selected.name}</span>
            <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
              <BsChevronExpand
                className='h-5 w-5 text-gray-400'
                aria-hidden='true'
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Listbox.Options className='absolute mt-1 max-h-60 w-full max-w-xs overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
              {subreddits.map((subreddit, i) => (
                <Listbox.Option
                  key={subreddit.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-orange-100 text-orange-900' : 'text-gray-900'
                    }`
                  }
                  value={subreddit}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {subreddit.name}
                      </span>
                      {selected ? (
                        <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-orange-600'>
                          <BsCheck2 className='h-5 w-5' aria-hidden='true' />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </>
  )
}
