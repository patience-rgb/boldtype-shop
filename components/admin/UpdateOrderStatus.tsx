'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ORDER_STATUSES } from '@/lib/utils'

type Props = { orderId: string; currentStatus: string }

export function UpdateOrderStatus({ orderId, currentStatus }: Props) {
  const router = useRouter()

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      toast.success(`Order status updated to ${newStatus}`)
      router.refresh()
    } else {
      toast.error('Failed to update status')
    }
  }

  return (
    <select
      defaultValue={currentStatus}
      onChange={handleChange}
      className="text-xs border-2 border-gray-200 rounded-lg px-2 py-1.5 font-semibold focus:outline-none focus:border-brand-purple"
    >
      {ORDER_STATUSES.map((s) => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  )
}
