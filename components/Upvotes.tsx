import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import { useState, useEffect } from 'react'
import {
  TbArrowBigUpFilled,
  TbArrowBigUp,
  TbArrowBigDownFilled,
  TbArrowBigDown,
} from 'react-icons/tb'

export default function Upvotes({ id, votes }) {
  const supabaseClient = useSupabaseClient()
  const session = useSession()

  const [isUpvoted, setIsUpvoted] = useState(false)
  const [isDownvoted, setIsDownvoted] = useState(false)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setTotal(
      votes.reduce((acc, curr) => (curr.is_upvote ? acc + 1 : acc - 1), 0)
    )
  }, [votes])

  useEffect(() => {
    setIsUpvoted(
      votes.some((v) => v.user_id === session?.user.id && v.is_upvote === true)
    )
    setIsDownvoted(
      votes.some((v) => v.user_id === session?.user.id && v.is_upvote === false)
    )
  }, [session?.user.id, votes])

  const handleUpvote = async () => {
    if (!session) throw new Error('User not signed in.')
    if (isUpvoted) {
      setIsUpvoted(false)
      setTotal((prev) => prev - 1)
      const { id } = votes.find((v) => v.user_id === session.user.id)
      await supabaseClient.from('post_votes').delete().eq('id', id)
    } else {
      setTotal((prev) => (isDownvoted ? prev + 2 : prev + 1))
      setIsUpvoted(true)
      setIsDownvoted(false)
      const { data, error } = await supabaseClient
        .from('post_votes')
        .upsert({ post_id: id, user_id: session.user.id, is_upvote: true })
        .select()
      if (error) throw error
      votes.unshift(data[0])
    }
  }

  const handleDownvote = async () => {
    if (!session) throw new Error('User not signed in.')
    if (isDownvoted) {
      setIsDownvoted(false)
      setTotal((prev) => prev + 1)
      const { id } = votes.find((v) => v.user_id === session.user.id)
      await supabaseClient.from('post_votes').delete().eq('id', id)
    } else {
      setTotal((prev) => (isUpvoted ? prev - 2 : prev - 1))
      setIsUpvoted(false)
      setIsDownvoted(true)
      const { data, error } = await supabaseClient
        .from('post_votes')
        .upsert({ post_id: id, user_id: session.user.id, is_upvote: false })
        .select()
      if (error) throw error
      votes.unshift(data[0])
    }
  }

  return (
    <div className='flex flex-col items-center font-bold text-sm bg-neutral-50 p-3'>
      <button onClick={handleUpvote}>
        {isUpvoted ? (
          <TbArrowBigUpFilled className='text-2xl text-orange-600' />
        ) : (
          <TbArrowBigUp className='text-2xl' />
        )}
      </button>
      <div>{total}</div>
      <button onClick={handleDownvote}>
        {isDownvoted ? (
          <TbArrowBigDownFilled className='text-2xl text-orange-600' />
        ) : (
          <TbArrowBigDown className='text-2xl' />
        )}
      </button>
    </div>
  )
}
