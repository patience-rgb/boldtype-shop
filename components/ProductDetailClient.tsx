'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ShoppingBag, Heart, Share2, ChevronRight, Truck, RefreshCw, Shield } from 'lucide-react'
import { useCart, useWishlist } from '@/lib/store'
import { formatPrice, getEffectivePrice, isOnSale, cn, SIZES } from '@/lib/utils'
import type { ProductWithRelations } from '@/types'
import { toast } from 'sonner'
import Link from 'next/link'

type Props = { product: ProductWithRelations }

export function ProductDetailClient({ product }: Props) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)

  const { addItem } = useCart()
  const { toggle, has } = useWishlist()
  const isWishlisted = has(product.id)

  const price = getEffectivePrice(product.basePrice, product.salePrice)
  const onSale = isOnSale(product.basePrice, product.salePrice)

  // Unique colours
  const colours = Array.from(
    new Map(product.variants.map((v) => [v.color, v.colorHex])).entries()
  )

  // Available sizes for selected colour
  const availableSizes = selectedColor
    ? product.variants
        .filter((v) => v.color === selectedColor)
        .map((v) => ({ size: v.size, stock: v.stock }))
    : []

  const selectedVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  )

  const handleAddToCart = async () => {
    if (!selectedColor) return toast.error('Pick a colour first!')
    if (!selectedSize) return toast.error('Pick a size!')
    if (!selectedVariant) return toast.error('Variant not found')
    if (selectedVariant.stock === 0) return toast.error('This one\'s sold out!')

    setAdding(true)
    addItem({
      id: selectedVariant.id,
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      color: selectedVariant.color,
      colorHex: selectedVariant.colorHex,
      size: selectedVariant.size,
      price,
      image: product.images[0]?.url ?? '',
      quantity: 1,
    })
    toast.success(`${product.name} added to cart! 🛍️`)
    setTimeout(() => setAdding(false), 600)
  }

  const categoryMap: Record<string, string> = {
    TSHIRT: 'T-Shirts',
    HOODIE: 'Hoodies',
    SWEATSHIRT: 'Sweatshirts',
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-brand-pink">Home</Link>
        <ChevronRight size={12} />
        <Link href="/shop" className="hover:text-brand-pink">Shop</Link>
        <ChevronRight size={12} />
        <Link href={`/shop/${product.category.toLowerCase()}s`} className="hover:text-brand-pink">
          {categoryMap[product.category] || product.category}
        </Link>
        <ChevronRight size={12} />
        <span className="text-brand-black font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100">
            {product.images[selectedImage] ? (
              <Image
                src={product.images[selectedImage].url}
                alt={product.images[selectedImage].alt || product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">👕</div>
            )}
            {onSale && (
              <div className="absolute top-4 left-4 bg-brand-pink text-white text-xs font-bold px-3 py-1.5 rounded-full">
                SALE
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    'relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all',
                    selectedImage === i ? 'border-brand-pink' : 'border-transparent'
                  )}
                >
                  <Image src={img.url} alt={img.alt || ''} fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-bold text-2xl sm:text-3xl leading-tight">{product.name}</h1>
            <button
              onClick={() => { toggle(product.id); toast(isWishlisted ? 'Removed from wishlist' : '❤️ Saved to wishlist!') }}
              className={cn(
                'p-3 rounded-full border-2 transition-all flex-shrink-0',
                isWishlisted ? 'bg-brand-pink text-white border-brand-pink' : 'border-gray-200 text-gray-400 hover:border-brand-pink hover:text-brand-pink'
              )}
            >
              <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mt-3">
            <span className="text-2xl font-bold text-brand-pink">{formatPrice(price)}</span>
            {onSale && (
              <span className="text-gray-400 line-through text-lg">{formatPrice(product.basePrice)}</span>
            )}
            {onSale && (
              <span className="bg-brand-pink/10 text-brand-pink text-xs font-bold px-2 py-1 rounded-full">
                Save {Math.round((1 - price / product.basePrice) * 100)}%
              </span>
            )}
          </div>

          <p className="text-gray-500 mt-4 leading-relaxed text-sm">{product.description}</p>

          {/* Colour selector */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-sm">Colour</span>
              {selectedColor && <span className="text-sm text-gray-500">{selectedColor}</span>}
            </div>
            <div className="flex flex-wrap gap-3">
              {colours.map(([color, hex]) => (
                <button
                  key={color}
                  title={color}
                  onClick={() => { setSelectedColor(color); setSelectedSize(null) }}
                  className={cn(
                    'w-9 h-9 rounded-full border-4 transition-all hover:scale-110',
                    selectedColor === color ? 'border-brand-pink scale-110' : 'border-transparent'
                  )}
                  style={{ background: hex, boxShadow: '0 0 0 2px #e5e7eb' }}
                />
              ))}
            </div>
          </div>

          {/* Size selector */}
          {selectedColor && (
            <div className="mt-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-sm">Size</span>
                <button className="text-xs text-brand-purple font-semibold hover:underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => {
                  const variantData = availableSizes.find((v) => v.size === size)
                  const isAvailable = variantData && variantData.stock > 0
                  const isLow = variantData && variantData.stock > 0 && variantData.stock <= 3

                  return (
                    <button
                      key={size}
                      disabled={!isAvailable}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        'min-w-[3rem] px-3 py-2 rounded-xl text-sm font-bold border-2 transition-all relative',
                        !isAvailable && 'opacity-30 cursor-not-allowed line-through',
                        selectedSize === size
                          ? 'bg-brand-black text-white border-brand-black'
                          : isAvailable
                          ? 'border-gray-200 hover:border-brand-pink hover:text-brand-pink'
                          : 'border-gray-200 text-gray-300'
                      )}
                    >
                      {size}
                      {isLow && isAvailable && (
                        <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-brand-pink rounded-full border border-white" />
                      )}
                    </button>
                  )
                })}
              </div>
              {availableSizes.some((v) => v.stock > 0 && v.stock <= 3) && (
                <p className="text-xs text-brand-pink font-semibold mt-2">● Almost gone! Low stock on some sizes</p>
              )}
            </div>
          )}

          {/* Add to cart */}
          <div className="mt-6 space-y-3">
            <button
              onClick={handleAddToCart}
              disabled={adding || !selectedColor || !selectedSize}
              className={cn(
                'btn-primary w-full justify-center text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
                adding && 'animate-bounce-in'
              )}
            >
              <ShoppingBag size={20} />
              {adding ? 'Added! 🎉' : 'Add to Cart'}
            </button>
            {!selectedColor && (
              <p className="text-xs text-center text-gray-400">Select a colour to continue</p>
            )}
          </div>

          {/* Delivery promises */}
          <div className="mt-6 space-y-2.5 border-t border-gray-100 pt-5">
            {[
              { Icon: Truck, text: 'Free shipping on orders over $75 CAD' },
              { Icon: RefreshCw, text: 'Easy 30-day returns & exchanges' },
              { Icon: Shield, text: 'Secure checkout via Stripe' },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5 text-sm text-gray-500">
                <Icon size={15} className="text-brand-pink flex-shrink-0" />
                {text}
              </div>
            ))}
          </div>

          {/* Product details */}
          {product.details && (
            <div className="mt-6 border-t border-gray-100 pt-5">
              <h3 className="font-bold text-sm mb-3">Product Details</h3>
              <div className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{product.details}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
