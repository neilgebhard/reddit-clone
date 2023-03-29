import React, { useEffect, useState } from 'react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import Image from 'next/image'
import { v4 as uuid } from 'uuid'

const imageUuid = uuid()

export default function ImageUpload({ onUpload }) {
  const supabase = useSupabaseClient()
  const [imageUrl, setImageUrl] = useState(null)
  const [uploading, setUploading] = useState(false)

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (
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
      console.log(data)
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
        <Image
          src={process.env.NEXT_PUBLIC_SUPABASE_IMAGE_BUCKET_URL + imageUrl}
          width={500}
          height={500}
          alt='Image'
        />
      ) : (
        <div className='flex items-center justify-center h-48 w-48 bg-neutral-100 border border-neutral-500 hover:border-neutral-700 hover:bg-neutral-200 border-dashed cursor-pointer overflow-hidden'>
          No Image
        </div>
      )}
      <div className='w-48'>
        <label
          className='button primary block bg-blue-600 hover:bg-blue-500 text-white mt-2 rounded px-2 py-1 text-center cursor-pointer'
          htmlFor='single'
        >
          {uploading ? 'Uploading ...' : 'Upload'}
        </label>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type='file'
          id='single'
          accept='image/*'
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  )
}
