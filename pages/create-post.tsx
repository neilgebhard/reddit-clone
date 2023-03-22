export default function CreatePost() {
  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <div className='max-w-2xl mx-auto mt-10'>
      <h1 className='text-xl mb-3'>Create a post</h1>
      <div className='bg-white rounded p-5'>
        <form onSubmit={handleSubmit}>
          <div className='mb-5'>
            <label className='uppercase text-sm font-semibold'>Title</label>
            <input
              className='block border w-full rounded px-2 py-1'
              type='text'
            />
          </div>
          <div className='mb-5'>
            <label className='uppercase text-sm font-semibold'>Text</label>
            <textarea
              className='block border w-full rounded px-2 py-1'
              placeholder='Text (optional)'
              rows={4}
            />
          </div>
          <div className='text-right'>
            <button className='rounded-full bg-gray-500 text-neutral-100 px-4 py-1'>
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
