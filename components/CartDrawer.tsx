'use client'

import Link from 'next/link'
import Image from 'next/image'
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import { useCart } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { useEffect } from 'react'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCart()

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col animate-slide-in-right shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-brand-pink" />
            <h2 className="font-bold text-lg">Your Cart</h2>
            {items.length > 0 && (
              <span className="bg-brand-pink text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <ShoppingBag size={56} className="text-gray-200 mb-4" />
            <h3 className="font-script text-2xl text-gray-400 mb-2">It&apos;s empty in here!</h3>
            <p className="text-sm text-gray-400 mb-6">Your cart is lonely. Let&apos;s fix that.</p>
            <Link
              href="/shop"
              onClick={closeCart}
              className="btn-primary"
            >
              Shop Now <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-3 animate-fade-in">
                  {/* Product image */}
                  <Link href={`/products/${item.productSlug}`} onClick={closeCart}>
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.image ? (
                        <Image src={item.image} alt={item.productName} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">👕</div>
                      )}
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.productSlug}`} onClick={closeCart}>
                      <h4 className="font-semibold text-sm leading-tight hover:text-brand-pink transition-colors truncate">
                        {item.productName}
                      </h4>
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="w-4 h-4 rounded-full border border-gray-200 flex-shrink-0"
                        style={{ background: item.colorHex }}
                      />
                      <span className="text-xs text-gray-500">{item.color} / {item.size}</span>
                    </div>
                    <p className="font-bold text-sm mt-1 text-brand-pink">{formatPrice(item.price)}</p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border-2 border-gray-200 rounded-full overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="p-1.5 hover:bg-gray-100 transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="p-1.5 hover:bg-gray-100 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-5 py-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Subtotal</span>
                <span className="font-bold text-lg">{formatPrice(total)}</span>
              </div>
              <p className="text-xs text-gray-400 text-center">
                Shipping & taxes calculated at checkout
              </p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="btn-primary w-full justify-center text-center"
              >
                Checkout <ArrowRight size={16} />
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="btn-outline w-full justify-center text-center text-sm"
              >
                View Full Cart
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  )
}
