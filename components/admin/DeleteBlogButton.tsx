'use client'

import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function DeleteBlogButton({ id, title }: { id: string; title: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Delete "${title}"?`)) return
    const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Post deleted')
      router.refresh()
    } else {
      toast.error('Failed to delete')
    }
  }

  return (
    <button onClick={handleDelete} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
      <Trash2 size={15} />
    </button>
  )
}
