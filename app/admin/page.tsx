import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Package, ShoppingCart, BookOpen, TrendingUp, Plus, ArrowRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Dashboard' }

export default async function AdminDashboard() {
  const [productCount, orderCount, blogCount, recentOrders, revenue] = await Promise.all([
    prisma.product.count({ where: { published: true } }),
    prisma.order.count(),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: true, user: { select: { name: true, email: true } } },
    }),
    prisma.order.aggregate({
      where: { status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] } },
      _sum: { total: true },
    }),
  ])

  const stats = [
    { label: 'Live Products', value: productCount, icon: Package, color: 'from-brand-pink to-red-400', href: '/admin/products' },
    { label: 'Total Orders', value: orderCount, icon: ShoppingCart, color: 'from-brand-purple to-blue-500', href: '/admin/orders' },
    { label: 'Blog Posts', value: blogCount, icon: BookOpen, color: 'from-brand-blue to-cyan-500', href: '/admin/blog' },
    { label: 'Revenue', value: formatPrice(revenue._sum.total || 0), icon: TrendingUp, color: 'from-brand-yellow to-orange-400', href: '/admin/orders' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-script text-4xl">dashboard.</h1>
          <p className="text-gray-500 text-sm mt-1">Here&apos;s what&apos;s happening with your store</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary text-sm py-2.5 px-5">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="group">
            <div className={`bg-gradient-to-br ${stat.color} rounded-2xl p-5 text-white shadow-sm hover:shadow-md transition-shadow`}>
              <div className="flex items-center justify-between mb-3">
                <stat.icon size={22} />
                <ArrowRight size={14} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm opacity-80">{stat.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl shadow-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-lg">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-brand-pink hover:underline flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            <ShoppingCart size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No orders yet — share the store link!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="font-semibold text-sm">#{order.id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-400">
                    {order.user?.name || order.guestEmail || 'Guest'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-brand-pink">{formatPrice(order.total)}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    order.status === 'PAID' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                    order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        {[
          { href: '/admin/products/new', label: 'Add New Product', emoji: '📦', color: 'bg-brand-pink/10 hover:bg-brand-pink/20 text-brand-pink' },
          { href: '/admin/blog/new', label: 'Write a Blog Post', emoji: '✍️', color: 'bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue' },
          { href: '/shop', label: 'Preview Store', emoji: '👀', color: 'bg-brand-purple/10 hover:bg-brand-purple/20 text-brand-purple' },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`${action.color} rounded-2xl p-5 flex items-center gap-3 font-semibold text-sm transition-colors`}
          >
            <span className="text-2xl">{action.emoji}</span>
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
