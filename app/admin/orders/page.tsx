import { prisma } from '@/lib/prisma'
import { formatPrice, formatDate, ORDER_STATUSES } from '@/lib/utils'
import { UpdateOrderStatus } from '@/components/admin/UpdateOrderStatus'
import { Package } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Orders' }

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: { select: { name: true } },
        },
      },
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-script text-3xl">orders.</h1>
        <p className="text-gray-500 text-sm mt-0.5">{orders.length} total orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm">
          <Package size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="font-script text-2xl text-gray-400">no orders yet!</h3>
          <p className="text-gray-400 text-sm mt-2">Share the store link and watch the orders roll in.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const address = order.shippingAddress ? JSON.parse(order.shippingAddress) : null
            const statusInfo = ORDER_STATUSES.find((s) => s.value === order.status)

            return (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
                  <div>
                    <p className="font-bold">#{order.id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`badge text-xs ${statusInfo?.color || 'bg-gray-100 text-gray-600'}`}>
                      {statusInfo?.label || order.status}
                    </span>
                    <span className="font-bold text-brand-pink">{formatPrice(order.total)}</span>
                    <UpdateOrderStatus orderId={order.id} currentStatus={order.status} />
                  </div>
                </div>

                <div className="px-5 py-4 grid sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Customer</p>
                    <p className="text-sm font-semibold">{order.user?.name || 'Guest'}</p>
                    <p className="text-xs text-gray-400">{order.user?.email || order.guestEmail}</p>
                  </div>
                  {address && (
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Ship To</p>
                      <p className="text-sm">{address.firstName} {address.lastName}</p>
                      <p className="text-xs text-gray-400">{address.city}, {address.province} {address.postalCode}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Items</p>
                    {order.items.map((item) => (
                      <p key={item.id} className="text-xs text-gray-600">
                        {item.quantity}× {item.product.name} ({item.color}/{item.size})
                      </p>
                    ))}
                  </div>
                </div>

                <div className="px-5 py-3 bg-gray-50 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
                  <span>Subtotal: {formatPrice(order.subtotal)} + Shipping: {formatPrice(order.shippingCost)} + Tax: {formatPrice(order.tax)}</span>
                  {order.trackingNumber && (
                    <span className="font-mono text-brand-purple font-semibold">Track: {order.trackingNumber}</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
