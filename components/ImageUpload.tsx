import { useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Image from 'next/image'
import { v4 as uuid } from 'uuid'
import { BeatLoader } from 'react-spinners'

const imageUuid = uuid()

export default function ImageUpload({ onUpload }) {
  const supabase = useSupabaseClient()
  const [imageUrl, setImageUrl] = useState(null)
  const [uploading, setUploading] = useState(false)

  const uploadImage: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    try {
      setUploading(true)
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }
      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${imageUuid}.${fileExt}`
      let { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, file, { upsert: true })
      if (error) throw error
      setImageUrl(data.path)
      onUpload(fileName)
    } catch (error) {
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {imageUrl ? (
        <>
          <Image
            src={process.env.NEXT_PUBLIC_SUPABASE_IMAGE_BUCKET_URL + imageUrl}
            width={600}
            height={100}
            alt='Image'
          />
          <label
            className={`inline-block text-white mt-2 rounded px-2 py-1 text-center ${
              uploading
                ? 'bg-neutral-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 cursor-pointer'
            }`}
            htmlFor='single'
          >
            {uploading ? (
              <BeatLoader size={10} color='white' />
            ) : (
              'Change Image'
            )}
          </label>
          <input
            className='hidden absolute'
            type='file'
            id='single'
            accept='image/*'
            onChange={uploadImage}
            disabled={uploading}
          />
        </>
      ) : (
        <div className='flex items-center justify-center border-2 border-blue-500 border-dashed overflow-hidden h-24 mb-3 rounded'>
          <label
            className={`block text-white mt-2 rounded px-2 py-1 text-center ${
              uploading
                ? 'bg-neutral-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 cursor-pointer'
            }`}
            htmlFor='single'
          >
            {uploading ? (
              <BeatLoader size={10} color='white' />
            ) : (
              'Upload an image'
            )}
          </label>
          <input
            className='hidden absolute'
            type='file'
            id='single'
            accept='image/*'
            onChange={uploadImage}
            disabled={uploading}
          />
        </div>
      )}
    </div>
  )
}
