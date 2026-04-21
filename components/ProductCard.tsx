'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Tag, Star } from 'lucide-react'
import { TShirtIcon } from '@/components/icons/ClothingIcons'
import { useWishlist, useCart } from '@/lib/store'
import { formatPrice, getEffectivePrice, isOnSale, cn } from '@/lib/utils'
import type { ProductWithRelations } from '@/types'
import { toast } from 'sonner'

type Props = {
  product: ProductWithRelations
}

export function ProductCard({ product }: Props) {
  const { toggle, has } = useWishlist()
  const { addItem, openCart } = useCart()
  const isWishlisted = has(product.id)
  const onSale = isOnSale(product.basePrice, product.salePrice)
  const price = getEffectivePrice(product.basePrice, product.salePrice)
  const primaryImage = product.images.find((i) => i.primary) || product.images[0]

  // Get unique colors
  const colors = Array.from(
    new Map(product.variants.map((v) => [v.color, v.colorHex])).entries()
  ).slice(0, 5)

  const inStock = product.variants.some((v) => v.stock > 0)

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    const firstVariant = product.variants.find((v) => v.stock > 0)
    if (!firstVariant) return toast.error('Out of stock')
    addItem({
      id: firstVariant.id,
      variantId: firstVariant.id,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      color: firstVariant.color,
      colorHex: firstVariant.colorHex,
      size: firstVariant.size,
      price,
      image: primaryImage?.url ?? '',
      quantity: 1,
    })
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <div className="group card relative">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-gray-100">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-pink/10 to-brand-purple/10">
            <TShirtIcon className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {onSale && (
            <span className="badge bg-brand-pink text-white text-[10px] gap-1">
              <Tag size={9} /> SALE
            </span>
          )}
          {product.featured && !onSale && (
            <span className="badge bg-brand-yellow text-brand-black text-[10px] gap-1">
              <Star size={9} /> FEATURED
            </span>
          )}
          {!inStock && (
            <span className="badge bg-gray-900 text-white text-[10px]">
              SOLD OUT
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            toggle(product.id)
            toast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!')
          }}
          className={cn(
            'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200',
            isWishlisted
              ? 'bg-brand-pink text-white'
              : 'bg-white/80 text-gray-400 hover:text-brand-pink hover:bg-white opacity-0 group-hover:opacity-100'
          )}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Quick add */}
        {inStock && (
          <button
            onClick={handleQuickAdd}
            className="absolute bottom-3 left-3 right-3 bg-brand-black text-white text-xs font-bold py-2 rounded-full flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200"
          >
            <ShoppingBag size={13} /> Quick Add
          </button>
        )}
      </Link>

      {/* Info */}
      <div className="p-3">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-sm leading-snug hover:text-brand-pink transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Color swatches */}
        {colors.length > 0 && (
          <div className="flex gap-1.5 mt-2">
            {colors.map(([color, hex]) => (
              <div
                key={color}
                title={color}
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200 cursor-pointer hover:scale-110 transition-transform"
                style={{ background: hex }}
              />
            ))}
            {product.variants.length > 5 && (
              <span className="text-[10px] text-gray-400 self-center">+{product.variants.length - 5}</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold text-sm">{formatPrice(price)}</span>
          {onSale && (
            <span className="text-xs text-gray-400 line-through">{formatPrice(product.basePrice)}</span>
          )}
        </div>
      </div>
    </div>
  )
}
