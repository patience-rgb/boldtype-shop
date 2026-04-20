import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, Zap, Heart } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/ProductCard'
import type { ProductWithRelations } from '@/types'

export const dynamic = 'force-dynamic'

async function getFeaturedProducts(): Promise<ProductWithRelations[]> {
  return prisma.product.findMany({
    where: { published: true, featured: true },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      variants: true,
    },
    take: 4,
    orderBy: { createdAt: 'desc' },
  })
}

const marqueeItems = [
  'BOLD. BRIGHT. TREND.',
  '✦ WEAR YOUR VIBE',
  '✦ FIND YOUR POWER COLOUR',
  '✦ BOLD. BRIGHT. TREND.',
  '✦ WEAR YOUR VIBE',
  '✦ FIND YOUR POWER COLOUR',
]

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div className="pt-[104px]">
      {/* Marquee */}
      <div className="bg-brand-purple text-white overflow-hidden py-3">
        <div className="marquee-track whitespace-nowrap text-sm font-bold tracking-widest uppercase">
          {marqueeItems.concat(marqueeItems).map((item, i) => (
            <span key={i} className="mx-8">{item}</span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section className="relative min-h-[90vh] bg-brand-black flex items-center overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-pink opacity-20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-20 w-96 h-96 bg-brand-purple opacity-20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-brand-blue opacity-10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-brand-pink/20 text-brand-pink border border-brand-pink/30 rounded-full px-4 py-2 text-sm font-bold mb-6">
                <Sparkles size={14} /> New Collection is Here
              </div>
              <h1 className="font-script text-6xl sm:text-7xl lg:text-8xl text-white leading-tight mb-6">
                wear your
                <span className="block text-brand-pink">boldest</span>
                <span className="text-brand-yellow">colours.</span>
              </h1>
              <p className="text-gray-300 text-lg mb-8 max-w-md leading-relaxed">
                High-saturation hoodies, tees & sweatshirts that make your complexion glow. Life&apos;s too short for boring clothes.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/shop" className="btn-primary text-base px-8 py-4">
                  Shop the Drop <ArrowRight size={18} />
                </Link>
                <Link href="/color-finder" className="btn-yellow text-base px-8 py-4">
                  <Sparkles size={18} /> Find My Colour
                </Link>
              </div>
            </div>

            {/* Hero product showcase */}
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 mt-8">
                  <div className="rounded-2xl overflow-hidden aspect-[3/4] bg-gradient-to-br from-brand-blue to-brand-purple relative">
                    <div className="absolute inset-0 flex items-center justify-center text-8xl">👕</div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 p-4">
                      <p className="text-white text-sm font-bold">BT Logo Hoodie</p>
                      <p className="text-brand-yellow text-xs">Electric Blue</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden aspect-square bg-gradient-to-br from-brand-pink to-red-400 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-7xl">🧥</div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 p-3">
                      <p className="text-white text-xs font-bold">& Then Sweatshirt</p>
                      <p className="text-brand-yellow text-xs">Hot Pink</p>
                    </div>
                  </div>
                  <div className="rounded-2xl overflow-hidden aspect-square bg-gradient-to-br from-gray-800 to-gray-900 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-7xl">🙌</div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 p-3">
                      <p className="text-white text-xs font-bold">Canada Hoodie</p>
                      <p className="text-brand-yellow text-xs">Classic Black</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-brand-yellow text-brand-black font-script text-lg px-5 py-3 rounded-2xl rotate-6 shadow-xl">
                Bold – Bright – Trend
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="section-heading mb-2">shop by vibe.</h2>
          <p className="text-gray-500">Every piece is made to turn heads. Pick your weapon.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              href: '/shop/tshirts', label: 'T-Shirts', bg: 'from-brand-pink to-pink-400', desc: 'Bold prints, louder energy',
              icon: (
                <svg className="w-14 h-14" viewBox="0 0 56 56" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 8C19 11 16 14 10 16L4 19L10 29L16 26V48H40V26L46 29L52 19L46 16C40 14 37 11 36 8C34 12 31 15 28 15C25 15 22 12 20 8Z" />
                </svg>
              ),
            },
            {
              href: '/shop/hoodies', label: 'Hoodies', bg: 'from-brand-purple to-blue-500', desc: 'Cosy meets statement',
              icon: (
                <svg className="w-14 h-14" viewBox="0 0 56 56" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 8C18 11 14 14 8 16L4 18L10 28L16 25V48H40V25L46 28L52 18L48 16C42 14 38 11 36 8C34 11 31 14 28 14C25 14 22 11 20 8Z" />
                  <path d="M20 8C21 14 22 20 22 28H34C34 20 35 14 36 8" />
                  <line x1="22" y1="36" x2="34" y2="36" />
                </svg>
              ),
            },
            {
              href: '/shop/sweatshirts', label: 'Sweatshirts', bg: 'from-brand-yellow to-orange-400', desc: 'Relaxed but make it pop',
              icon: (
                <svg className="w-14 h-14" viewBox="0 0 56 56" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10C19 13 16 15 10 17L4 20L10 30L16 27V48H40V27L46 30L52 20L46 17C40 15 37 13 36 10C34 13 31 16 28 16C25 16 22 13 20 10Z" />
                  <path d="M22 10C22 13 25 16 28 16C31 16 34 13 34 10" />
                </svg>
              ),
            },
          ].map((cat) => (
            <Link key={cat.href} href={cat.href} className="group relative overflow-hidden rounded-3xl">
              <div className={`bg-gradient-to-br ${cat.bg} p-8 min-h-[220px] flex flex-col justify-between transition-transform duration-300 group-hover:scale-[1.02]`}>
                <span>{cat.icon}</span>
                <div>
                  <h3 className="text-2xl font-bold text-white">{cat.label}</h3>
                  <p className="text-white/80 text-sm mt-1">{cat.desc}</p>
                  <span className="inline-flex items-center gap-1 text-white font-semibold text-sm mt-3 group-hover:gap-2 transition-all">
                    Shop Now <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-heading mb-1">the hot list.</h2>
              <p className="text-gray-500 text-sm">Everyone&apos;s grabbing these rn</p>
            </div>
            <Link href="/shop" className="btn-outline text-sm py-2 px-5">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Colour Finder CTA */}
      <section className="mx-4 sm:mx-6 lg:mx-8 my-8 rounded-3xl bg-gradient-to-r from-brand-purple via-brand-blue to-brand-pink overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 text-white rounded-full px-4 py-2 text-sm font-bold mb-5">
              <Sparkles size={14} /> New Feature
            </div>
            <h2 className="font-script text-5xl text-white mb-4">find your power colour.</h2>
            <p className="text-white/90 text-base leading-relaxed mb-6">
              Your skin&apos;s undertone is the key to making our high-saturation pieces truly <em>pop</em>. Take our 3-step quiz and unlock 2–3 shades that were literally made for you.
            </p>
            <Link href="/color-finder" className="bg-white text-brand-purple font-bold px-8 py-4 rounded-full inline-flex items-center gap-2 hover:bg-brand-yellow hover:text-brand-black transition-all duration-200 hover:scale-105">
              <Zap size={18} /> Take the Quiz — It&apos;s Free
            </Link>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="grid grid-cols-3 gap-3">
              {[
                { color: '#FF3E8E', label: 'Cool' },
                { color: '#FFD600', label: 'Warm' },
                { color: '#00A3E0', label: 'Neutral' },
                { color: '#5C00D8', label: 'Cool' },
                { color: '#4CAF50', label: 'Warm' },
                { color: '#FF6B6B', label: 'Cool' },
              ].map(({ color, label }, i) => (
                <div
                  key={i}
                  className="w-16 h-16 rounded-2xl shadow-lg flex items-end justify-center pb-1 text-[9px] font-bold text-white/80"
                  style={{ background: color, transform: i % 2 === 0 ? 'translateY(-6px)' : '' }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Brand promise */}
      <section className="py-16 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-3 gap-8 text-center">
          {[
            { icon: '⚡', title: 'Bold by Design', desc: 'Every piece is crafted to stand out. Loud colours, bolder prints.' },
            { icon: '🌈', title: 'Made for Every Skin Tone', desc: 'Our colour curation celebrates all complexions. Find your glow.' },
            { icon: '💌', title: 'Ships Across Canada', desc: 'Free shipping on orders $75+. Packaged with love, obviously.' },
          ].map((item) => (
            <div key={item.title} className="p-8 rounded-3xl bg-gray-50 hover:bg-brand-pink/5 transition-colors group">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-brand-pink transition-colors">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Blog */}
      <section className="py-16 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8 bg-brand-black rounded-3xl mb-8 mx-4 sm:mx-6 lg:mx-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-script text-4xl text-white">from the blog.</h2>
          <Link href="/blog" className="text-brand-pink text-sm font-semibold hover:text-pink-400 flex items-center gap-1">
            All Posts <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: '5 Bold Colour Combos You Need This Season', tag: 'Style Tips', date: 'Apr 2025' },
            { title: 'How to Know Your Skin Undertone in 3 Steps', tag: 'Colour Guide', date: 'Mar 2025' },
            { title: "Why We're Obsessed with High-Saturation Prints", tag: 'Brand Story', date: 'Feb 2025' },
          ].map((post) => (
            <Link href="/blog" key={post.title} className="group block">
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-brand-pink/20 to-brand-purple/20 border border-white/10 mb-4 flex items-center justify-center text-4xl group-hover:scale-[1.02] transition-transform">
                📝
              </div>
              <span className="text-brand-pink text-xs font-bold uppercase tracking-wider">{post.tag}</span>
              <h3 className="text-white font-bold text-sm mt-1 mb-2 group-hover:text-brand-pink transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-gray-500 text-xs">{post.date}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
