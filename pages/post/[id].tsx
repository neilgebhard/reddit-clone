import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'

// TODO: Post page
export const getServerSideProps = async (context) => {
  const { id } = context.query

  let { data: post } = await supabase
    .from('posts')
    .select('*, profiles(*)')
    .eq('id', id)
    .single()

  console.log(post)

  return {
    props: { post },
  }
}

const Post = ({ post }) => {
  return <pre>Post: {JSON.stringify(post, null, 2)}</pre>
}

export default Post
