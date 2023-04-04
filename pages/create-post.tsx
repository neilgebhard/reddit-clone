import { Fragment, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from '@supabase/auth-helpers-react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { supabase } from '@/lib/supabaseClient'
import { Listbox, Transition } from '@headlessui/react'
import { BsCheck2, BsChevronDown, BsImage, BsLink } from 'react-icons/bs'
import ImageUpload from '@/components/ImageUpload'
import { TbArticle } from 'react-icons/tb'
import Head from 'next/head'

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
  const [type, setType] = useState(router.query.type || 'post')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!session) throw new Error('User not signed in.')

    const posted_by = session.user.id
    const title = e.target.elements.title.value

    let text
    let url

    if (type === 'post') {
      text = e.target.elements.text.value
    }

    if (type === 'link') {
      url = e.target.elements.link.value
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          posted_by,
          title,
          text,
          image_url: imageUrl,
          url,
          subreddit: selected.id,
        },
      ])
      .select()

    if (error) throw error

    router.push(`/post/${data[0].id}`)
  }

  const onUpload = (imageUrl) => {
    setImageUrl(process.env.NEXT_PUBLIC_SUPABASE_IMAGE_BUCKET_URL + imageUrl)
  }

  return (
    <>
      <Head>
        <title>Create Post</title>
        <meta name='description' content='Create a post' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='max-w-2xl mx-auto mt-10'>
        <h1 className='text-xl mb-3'>Create a post</h1>
        <hr className='mb-4' />
        <form onSubmit={handleSubmit}>
          <div className='mb-2'>
            <ListBox
              subreddits={subreddits}
              selected={selected}
              setSelected={setSelected}
            />
          </div>
          <div className='bg-white rounded border'>
            <div className='flex divide-x text-neutral-500 font-semibold'>
              <button
                className={`grow border-b py-4 hover:bg-neutral-50 cursor-pointer flex items-center justify-center gap-2 ${
                  type === 'post' &&
                  'border-b-2 border-b-blue-600 text-blue-600'
                }`}
                onClick={() => setType('post')}
                type='button'
              >
                <TbArticle className='text-2xl' /> Post
              </button>
              <button
                className={`grow border-b py-4 hover:bg-neutral-50 cursor-pointer flex items-center justify-center gap-2 ${
                  type === 'image' &&
                  'border-b-2 border-b-blue-600 text-blue-600'
                }`}
                onClick={() => setType('image')}
                type='button'
              >
                <BsImage className='text-xl' /> Image
              </button>
              <button
                className={`grow border-b py-4 hover:bg-neutral-50 cursor-pointer flex items-center justify-center gap-2 ${
                  type === 'link' &&
                  'border-b-2 border-b-blue-600 text-blue-600'
                }`}
                onClick={() => setType('link')}
                type='button'
              >
                <BsLink className='text-2xl' /> Link
              </button>
            </div>
            <div className='p-5'>
              <div className='mb-5'>
                <label
                  className='uppercase text-sm font-semibold'
                  htmlFor='title'
                >
                  Title
                </label>
                <input
                  id='title'
                  className='block border w-full rounded px-2 py-1'
                  type='text'
                />
              </div>
              {type === 'post' && (
                <div className='mb-5'>
                  <label
                    className='uppercase text-sm font-semibold'
                    htmlFor='text'
                  >
                    Text
                  </label>
                  <textarea
                    id='text'
                    className='block border w-full rounded px-2 py-1'
                    placeholder='Text (optional)'
                    rows={4}
                  />
                </div>
              )}
              {type === 'image' && <ImageUpload onUpload={onUpload} />}
              {type === 'link' && (
                <div className='mb-5'>
                  <label
                    className='uppercase text-sm font-semibold'
                    htmlFor='link'
                  >
                    Link
                  </label>
                  <input
                    id='link'
                    className='block border w-full rounded px-2 py-1'
                    type='url'
                    placeholder='https://example.com'
                  />
                </div>
              )}
              <div className='text-right'>
                <button className='rounded-full bg-neutral-600 hover:bg-neutral-500 text-neutral-100 px-4 py-1'>
                  Post
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </>
  )
}

function ListBox({ subreddits, selected, setSelected }) {
  return (
    <>
      <Listbox value={selected} onChange={setSelected}>
        <div className='relative mt-1'>
          <Listbox.Label className='uppercase text-sm font-semibold block mb-1'>
            Choose a community
          </Listbox.Label>
          <Listbox.Button className='relative w-full max-w-xs cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm'>
            <span className='block truncate'>{selected.name}</span>
            <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
              <BsChevronDown
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
