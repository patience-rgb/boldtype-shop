'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BookOpen,
  Settings,
  PlusCircle,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/blog', label: 'Blog', icon: BookOpen },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  const content = (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-white/10">
        <span className="font-script text-2xl text-brand-pink">boldtype.</span>
        <p className="text-xs text-gray-400 mt-0.5 font-semibold uppercase tracking-wider">Admin</p>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all',
              isActive(href, exact)
                ? 'bg-brand-pink text-white shadow-md shadow-pink-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}

        <div className="pt-3 border-t border-white/10 mt-3 space-y-1">
          <p className="text-xs text-gray-600 px-4 pb-1 font-bold uppercase tracking-wider">Quick Add</p>
          <Link
            href="/admin/products/new"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-brand-yellow hover:bg-white/10 transition-all"
          >
            <PlusCircle size={18} /> New Product
          </Link>
          <Link
            href="/admin/blog/new"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-brand-blue hover:bg-white/10 transition-all"
          >
            <PlusCircle size={18} /> New Blog Post
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-white/10">
        <Link href="/" className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors">
          ← View Live Site
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-20 left-4 z-50 lg:hidden bg-brand-black text-white p-2 rounded-xl shadow-lg"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-[72px] left-0 bottom-0 w-64 bg-brand-black z-40 transition-transform duration-300',
          'lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {content}
      </aside>
    </>
  )
}
