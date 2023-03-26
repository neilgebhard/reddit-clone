import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { GoChevronDown } from 'react-icons/go'
import { FaRegUserCircle } from 'react-icons/fa'
import { BiLogOut } from 'react-icons/bi'
import { useRouter } from 'next/router'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function Dropdown() {
  const supabaseClient = useSupabaseClient()
  const router = useRouter()

  const handleSignOut = async () => {
    let { error } = await supabaseClient.auth.signOut()
    router.push('/')
  }

  return (
    <div className='top-16 w-56 text-right'>
      <Menu as='div' className='relative inline-block text-left'>
        <div>
          <Menu.Button className='inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'>
            <FaRegUserCircle
              className='text-neutral-700 hover:text-neutral-600'
              size={25}
            />
            <GoChevronDown
              className='ml-1 -mr-1 h-5 w-5 text-neutral-700 hover:text-neutral-600'
              aria-hidden='true'
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Menu.Items className='absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
            <div className='px-1 py-1 '>
              <Menu.Item>
                {({ active }) => (
                  <a
                    className={`${
                      active ? 'bg-orange-500 text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm cursor-pointer`}
                    href='/account'
                  >
                    {active ? (
                      <FaRegUserCircle
                        className='mr-2 h-5 w-5 text-white'
                        aria-hidden='true'
                      />
                    ) : (
                      <FaRegUserCircle
                        className='mr-2 h-5 w-5'
                        aria-hidden='true'
                      />
                    )}
                    Account
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-orange-500 text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm cursor-pointer`}
                    onClick={handleSignOut}
                  >
                    {active ? (
                      <BiLogOut
                        className='mr-2 h-5 w-5 text-white'
                        aria-hidden='true'
                      />
                    ) : (
                      <BiLogOut className='mr-2 h-5 w-5' aria-hidden='true' />
                    )}
                    Sign Out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
