'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

function compressImage(file: File, maxPx = 1400, quality = 0.82): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => {
      let { width, height } = img
      if (width > maxPx || height > maxPx) {
        if (width >= height) { height = Math.round((height * maxPx) / width); width = maxPx }
        else { width = Math.round((width * maxPx) / height); height = maxPx }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width; canvas.height = height
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => blob
          ? resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }))
          : reject(new Error('Compression failed')),
        'image/jpeg', quality
      )
      URL.revokeObjectURL(img.src)
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

type BlogFormData = {
  title: string
  excerpt: string
  content: string
  coverImage: string
  tags: string
  published: boolean
}

type Props = {
  initialData?: Partial<BlogFormData> & { id?: string }
  mode: 'create' | 'edit'
}

const DEFAULT: BlogFormData = {
  title: '',
  excerpt: '',
  content: '',
  coverImage: '',
  tags: '',
  published: false,
}

export function BlogForm({ initialData, mode }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<BlogFormData>({ ...DEFAULT, ...initialData })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleCoverUpload = async (file: File) => {
    setUploading(true)
    try {
      const compressed = await compressImage(file)
      const fd = new FormData()
      fd.append('file', compressed)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const { url } = await res.json()
      setForm((f) => ({ ...f, coverImage: url }))
      toast.success('Cover image uploaded!')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title) return toast.error('Title is required')
    if (!form.excerpt) return toast.error('Excerpt is required')
    setSaving(true)

    try {
      const url = mode === 'edit' ? `/api/blog/${initialData?.id}` : '/api/blog'
      const method = mode === 'edit' ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error('Failed to save')
      toast.success(mode === 'edit' ? 'Post updated!' : 'Post created!')
      router.push('/admin/blog')
      router.refresh()
    } catch {
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-base mb-2">Post Details</h2>
        <div>
          <label className="label">Title *</label>
          <input className="input" placeholder="Something bold and catchy..." value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div>
          <label className="label">Excerpt *</label>
          <textarea className="input resize-none h-20" placeholder="A short teaser (shown in blog listings)..." value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} required />
        </div>
        <div>
          <label className="label">Tags</label>
          <input className="input" placeholder="Style Tips, Colour Guide, Brand Story (comma-separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
        </div>
      </div>

      {/* Cover image */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-base mb-4">Cover Image</h2>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) { handleCoverUpload(e.target.files[0]); e.target.value = '' } }} />
        {form.coverImage ? (
          <div className="relative w-full max-w-md aspect-video rounded-2xl overflow-hidden group">
            <Image src={form.coverImage} alt="Cover" fill className="object-cover" sizes="400px" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="bg-white text-brand-black font-semibold text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-brand-yellow transition-colors"
              >
                <RefreshCw size={12} /> Change
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, coverImage: '' })}
                className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-red-600 transition-colors"
              >
                <X size={12} /> Remove
              </button>
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <p className="text-white text-sm font-semibold">Uploading...</p>
              </div>
            )}
          </div>
        ) : (
          <div
            className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:border-brand-pink transition-colors max-w-md"
            onClick={() => fileRef.current?.click()}
          >
            <Upload size={28} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-400">{uploading ? 'Uploading...' : 'Click to upload cover image'}</p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-base mb-4">Content</h2>
        <p className="text-xs text-gray-400 mb-2">You can use basic HTML tags (e.g. &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;)</p>
        <textarea
          className="input resize-none h-64 font-mono text-sm"
          placeholder="Write something bold and inspiring..."
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
      </div>

      {/* Visibility */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" className="w-5 h-5 accent-brand-pink" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
          <div>
            <p className="font-semibold text-sm">Publish this post</p>
            <p className="text-xs text-gray-400">Visible to everyone on the blog</p>
          </div>
        </label>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? 'Saving...' : mode === 'edit' ? 'Update Post' : 'Create Post'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline">Cancel</button>
      </div>
    </form>
  )
}
