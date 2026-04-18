'use client'

import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'
import { useWishlist } from '@/lib/store'
import { useEffect, useState } from 'react'
import type { ProductWithRelations } from '@/types'
import { ProductCard } from '@/components/ProductCard'

export default function WishlistPage() {
  const { productIds } = useWishlist()
  const [products, setProducts] = useState<ProductWithRelations[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (productIds.length === 0) { setLoading(false); return }
      const res = await fetch('/api/products?published=true')
      const all: ProductWithRelations[] = await res.json()
      setProducts(all.filter((p) => productIds.includes(p.id)))
      setLoading(false)
    }
    load()
  }, [productIds])

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Heart size={28} className="text-brand-pink" fill="currentColor" />
          <h1 className="font-script text-4xl">your wishlist.</h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-200 animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <Heart size={56} className="text-gray-200 mx-auto mb-4" />
            <h3 className="font-script text-3xl text-gray-400 mb-2">nothing saved yet!</h3>
            <p className="text-gray-400 text-sm mb-6">
              Hit that ❤️ on any product to save it here for later.
            </p>
            <Link href="/shop" className="btn-primary">
              <ShoppingBag size={16} /> Browse Products
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-6">{products.length} saved {products.length === 1 ? 'item' : 'items'}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
