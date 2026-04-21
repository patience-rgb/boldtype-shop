'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { SlidersHorizontal, X, Flame } from 'lucide-react'

type Props = {
  categories: { value: string; label: string }[]
  activeCategory: string
  activeSort: string
  isSale?: boolean
}

export function ShopFilters({ categories, activeCategory, activeSort, isSale }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearFilters = () => router.push(pathname)

  const hasFilters = activeCategory || activeSort || isSale

  return (
    <div className="flex flex-wrap items-center gap-3 mb-8">
      <div className="flex items-center gap-1.5 text-sm text-gray-500 font-semibold mr-2">
        <SlidersHorizontal size={15} /> Filter:
      </div>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setParam('category', cat.value)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all',
              activeCategory === cat.value || (cat.value === '' && !activeCategory)
                ? 'bg-brand-black text-white border-brand-black'
                : 'border-gray-200 hover:border-brand-pink hover:text-brand-pink bg-white'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Sale toggle */}
      <button
        onClick={() => setParam('filter', isSale ? '' : 'sale')}
        className={cn(
          'px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all',
          isSale
            ? 'bg-brand-pink text-white border-brand-pink'
            : 'border-gray-200 hover:border-brand-pink hover:text-brand-pink bg-white'
        )}
      >
        <Flame size={14} className="inline mr-1" /> Sale
      </button>

      {/* Sort */}
      <select
        value={activeSort}
        onChange={(e) => setParam('sort', e.target.value)}
        className="px-4 py-2 rounded-full text-sm font-semibold border-2 border-gray-200 bg-white focus:outline-none focus:border-brand-pink appearance-none cursor-pointer"
      >
        <option value="">Newest First</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="px-3 py-2 rounded-full text-xs font-bold text-red-500 border-2 border-red-200 hover:bg-red-50 flex items-center gap-1 transition-colors"
        >
          <X size={12} /> Clear
        </button>
      )}
    </div>
  )
}
