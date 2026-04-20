'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { TShirtIcon } from '@/components/icons/ClothingIcons'
import { useCart } from '@/lib/store'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart()

  const shipping = total >= 75 ? 0 : 9.99
  const tax = total * 0.13
  const orderTotal = total + shipping + tax

  if (items.length === 0) {
    return (
      <div className="pt-[104px] min-h-[60vh] flex items-center justify-center text-center px-4">
        <div>
          <ShoppingBag size={64} className="text-gray-200 mx-auto mb-4" />
          <h2 className="font-script text-4xl text-gray-300 mb-2">cart&apos;s empty!</h2>
          <p className="text-gray-400 mb-8 text-sm">Go on then — find something bold!</p>
          <Link href="/shop" className="btn-primary">
            Shop Now <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-script text-4xl mb-8 flex items-center gap-2">your cart. <ShoppingBag size={32} /></h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.variantId} className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm">
                <Link href={`/products/${item.productSlug}`}>
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.productName} fill className="object-cover" sizes="96px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><TShirtIcon className="w-10 h-10 text-gray-400" /></div>
                    )}
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.productSlug}`}>
                    <h3 className="font-bold text-sm hover:text-brand-pink transition-colors">{item.productName}</h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-4 h-4 rounded-full border border-gray-200" style={{ background: item.colorHex }} />
                    <span className="text-xs text-gray-500">{item.color} / Size {item.size}</span>
                  </div>
                  <p className="font-bold text-brand-pink mt-1">{formatPrice(item.price)}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border-2 border-gray-200 rounded-full overflow-hidden">
                      <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="p-2 hover:bg-gray-100">
                        <Minus size={12} />
                      </button>
                      <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="p-2 hover:bg-gray-100">
                        <Plus size={12} />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.variantId)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="text-right font-bold text-sm hidden sm:block">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="font-bold text-lg mb-5">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-semibold' : 'font-semibold'}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-400 bg-gray-50 p-2 rounded-lg">
                    Add {formatPrice(75 - total)} more for free shipping!
                  </p>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax (HST 13%)</span>
                  <span className="font-semibold">{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-brand-pink">{formatPrice(orderTotal)}</span>
                </div>
              </div>
              <Link href="/checkout" className="btn-primary w-full justify-center mt-5">
                Checkout <ArrowRight size={16} />
              </Link>
              <Link href="/shop" className="btn-outline w-full justify-center mt-3 text-sm">
                Keep Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
