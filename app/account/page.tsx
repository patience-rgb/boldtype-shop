import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatPrice, formatDate } from '@/lib/utils'
import { ORDER_STATUSES } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'My Account' }

export default async function AccountPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin?callbackUrl=/account')

  const user = session.user as { id?: string }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: { include: { images: { where: { primary: true } } } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-script text-4xl">hey, {session.user?.name?.split(' ')[0] || 'you'}. 👋</h1>
            <p className="text-gray-500 text-sm mt-1">{session.user?.email}</p>
          </div>
          <Link href="/account/wishlist" className="btn-outline text-sm py-2 px-5">
            ❤️ Wishlist
          </Link>
        </div>

        <h2 className="font-bold text-xl mb-4">Your Orders</h2>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <p className="text-4xl mb-4">📦</p>
            <h3 className="font-script text-2xl text-gray-400 mb-2">no orders yet!</h3>
            <p className="text-gray-400 text-sm mb-6">Time to fix that. Go grab something bold!</p>
            <Link href="/shop" className="btn-primary">Shop Now</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusInfo = ORDER_STATUSES.find((s) => s.value === order.status)
              return (
                <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                    <div>
                      <p className="font-bold text-sm">Order #{order.id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`badge text-xs ${statusInfo?.color || 'bg-gray-100 text-gray-600'}`}>
                        {statusInfo?.label || order.status}
                      </span>
                      <span className="font-bold text-brand-pink">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex-shrink-0 text-center">
                        <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                          {item.product.images[0] ? (
                            <img src={item.product.images[0].url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl">👕</span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">{item.color}/{item.size}</p>
                      </div>
                    ))}
                  </div>
                  {order.trackingNumber && (
                    <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                      Tracking: <span className="font-mono text-brand-purple">{order.trackingNumber}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
