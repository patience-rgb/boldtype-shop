'use client'

import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return

    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Product deleted')
      router.refresh()
    } else {
      toast.error('Failed to delete product')
    }
  }

  return (
    <button onClick={handleDelete} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
      <Trash2 size={15} />
    </button>
  )
}
