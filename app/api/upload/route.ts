import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const user = session?.user as { role?: string } | undefined
  if (!session || user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, WebP, GIF allowed.' }, { status: 400 })
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Max 10MB.' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUri = `data:${file.type};base64,${base64}`

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    // If Cloudinary is not configured, fall back to a placeholder response
    // (for local dev without Cloudinary)
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'Image hosting not configured. Set CLOUDINARY_* environment variables.' },
        { status: 503 }
      )
    }

    const timestamp = Math.round(Date.now() / 1000)
    const signaturePayload = `folder=boldtype&timestamp=${timestamp}${apiSecret}`

    // Use Web Crypto API (available in Next.js edge/node runtime)
    const encoder = new TextEncoder()
    const data = encoder.encode(signaturePayload)
    const hashBuffer = await crypto.subtle.digest('SHA-1', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const signature = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

    const uploadForm = new FormData()
    uploadForm.append('file', dataUri)
    uploadForm.append('api_key', apiKey)
    uploadForm.append('timestamp', String(timestamp))
    uploadForm.append('signature', signature)
    uploadForm.append('folder', 'boldtype')

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: uploadForm }
    )

    if (!res.ok) {
      const err = await res.text()
      console.error('Cloudinary error:', err)
      return NextResponse.json({ error: 'Upload to Cloudinary failed' }, { status: 500 })
    }

    const result = await res.json()
    return NextResponse.json({ url: result.secure_url }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
