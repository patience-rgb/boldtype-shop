'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingBag, Heart, User, Menu, X, Search, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCart } from '@/lib/store'
import { cn } from '@/lib/utils'

type Props = {
  logoUrl?: string
}

const navLinks = [
  { href: '/shop', label: 'Shop All', isColorFinder: false },
  { href: '/shop/tshirts', label: 'T-Shirts', isColorFinder: false },
  { href: '/shop/hoodies', label: 'Hoodies', isColorFinder: false },
  { href: '/shop/sweatshirts', label: 'Sweatshirts', isColorFinder: false },
  { href: '/color-finder', label: 'Find Your Color', isColorFinder: true },
  { href: '/blog', label: 'Blog', isColorFinder: false },
]

export function Navbar({ logoUrl }: Props) {
  const { data: session } = useSession()
  const { count, openCart } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  type SessionUser = { role?: string; id?: string; name?: string | null; email?: string | null; image?: string | null }
  const user = session?.user as SessionUser | undefined

  return (
    <header
      className={cn(
        'fixed top-9 left-0 right-0 z-40 transition-all duration-300',
        scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          {logoUrl ? (
            <Image src={logoUrl} alt="BoldType Logo" height={40} width={140} className="h-10 w-auto object-contain" />
          ) : (
            <span className="font-script text-3xl text-brand-pink leading-none">boldtype.</span>
          )}
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  'text-sm font-semibold hover:text-brand-pink transition-colors',
                  link.isColorFinder &&
                    'text-brand-purple hover:text-brand-pink bg-purple-50 px-3 py-1 rounded-full'
                )}
              >
                {link.isColorFinder ? <><Sparkles size={14} className="inline mr-1" />{link.label}</> : link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link href="/search" className="p-2 hover:text-brand-pink transition-colors hidden sm:flex" aria-label="Search">
            <Search size={20} />
          </Link>
          <Link href="/account/wishlist" className="p-2 hover:text-brand-pink transition-colors hidden sm:flex" aria-label="Wishlist">
            <Heart size={20} />
          </Link>

          {session ? (
            <div className="relative group hidden sm:block">
              <button className="p-2 hover:text-brand-pink transition-colors flex items-center gap-1">
                <User size={20} />
              </button>
              <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[180px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-semibold truncate">{session.user?.name || session.user?.email}</p>
                </div>
                <Link href="/account" className="block px-4 py-2 text-sm hover:bg-gray-50 hover:text-brand-pink">My Orders</Link>
                <Link href="/account/wishlist" className="block px-4 py-2 text-sm hover:bg-gray-50 hover:text-brand-pink">Wishlist</Link>
                {user?.role === 'ADMIN' && (
                  <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-gray-50 hover:text-brand-purple font-semibold">Admin Panel</Link>
                )}
                <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-500">
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link href="/auth/signin" className="hidden sm:flex p-2 hover:text-brand-pink transition-colors" aria-label="Sign In">
              <User size={20} />
            </Link>
          )}

          <button onClick={openCart} className="relative p-2 hover:text-brand-pink transition-colors" aria-label="Cart">
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-brand-pink text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce-in">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 hover:text-brand-pink transition-colors ml-1"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2 animate-fade-in shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-sm font-semibold border-b border-gray-50 hover:text-brand-pink transition-colors"
            >
              {link.isColorFinder ? <><Sparkles size={14} className="inline mr-1" />{link.label}</> : link.label}
            </Link>
          ))}
          {session ? (
            <>
              <Link href="/account" onClick={() => setMenuOpen(false)} className="block py-3 text-sm font-semibold border-b border-gray-50 hover:text-brand-pink">My Account</Link>
              {user?.role === 'ADMIN' && (
                <Link href="/admin" onClick={() => setMenuOpen(false)} className="block py-3 text-sm font-semibold text-brand-purple border-b border-gray-50">Admin Panel</Link>
              )}
              <button onClick={() => signOut({ callbackUrl: '/' })} className="block py-3 text-sm font-semibold text-red-500">Sign Out</button>
            </>
          ) : (
            <Link href="/auth/signin" onClick={() => setMenuOpen(false)} className="block py-3 text-sm font-semibold border-b border-gray-50 hover:text-brand-pink">
              Sign In / Register
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
