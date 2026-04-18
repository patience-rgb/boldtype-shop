'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Lock, CreditCard, CheckCircle2 } from 'lucide-react'
import { useCart } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type CheckoutForm = {
  firstName: string
  lastName: string
  email: string
  address: string
  address2?: string
  city: string
  province: string
  postalCode: string
  country: string
  phone: string
  cardNumber: string
  cardExpiry: string
  cardCvc: string
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const [placing, setPlacing] = useState(false)
  const [placed, setPlaced] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
    defaultValues: { country: 'Canada' }
  })

  const shipping = total >= 75 ? 0 : 9.99
  const tax = total * 0.13
  const orderTotal = total + shipping + tax

  const onSubmit = async (data: CheckoutForm) => {
    setPlacing(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            variantId: i.variantId,
            productId: i.productId,
            quantity: i.quantity,
            price: i.price,
            color: i.color,
            size: i.size,
          })),
          guestEmail: data.email,
          shippingAddress: {
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            address2: data.address2,
            city: data.city,
            province: data.province,
            postalCode: data.postalCode,
            country: data.country,
            phone: data.phone,
          },
          subtotal: total,
          shippingCost: shipping,
          tax,
          total: orderTotal,
        }),
      })

      if (!res.ok) throw new Error('Order failed')
      clearCart()
      setPlaced(true)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  if (items.length === 0 && !placed) {
    return (
      <div className="pt-[104px] min-h-[60vh] flex items-center justify-center text-center">
        <div>
          <p className="text-5xl mb-4">🛍️</p>
          <h2 className="font-script text-3xl text-gray-400 mb-4">nothing to checkout!</h2>
          <Link href="/shop" className="btn-primary">Go Shopping</Link>
        </div>
      </div>
    )
  }

  if (placed) {
    return (
      <div className="pt-[104px] min-h-[60vh] flex items-center justify-center text-center px-4">
        <div className="animate-bounce-in">
          <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
          <h2 className="font-script text-4xl mb-2">order placed! 🎉</h2>
          <p className="text-gray-500 mb-2 text-sm">Thanks for shopping bold. We&apos;re on it!</p>
          <p className="text-gray-400 text-xs mb-8">You&apos;ll receive a confirmation email shortly.</p>
          <Link href="/shop" className="btn-primary">Keep Shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-pink mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Cart
        </Link>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Contact */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-lg mb-5">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="label">Email</label>
                    <input
                      className="input"
                      type="email"
                      placeholder="you@example.com"
                      {...register('email', { required: 'Email is required' })}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="label">Phone</label>
                    <input className="input" type="tel" placeholder="+1 (555) 000-0000" {...register('phone')} />
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-lg mb-5">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">First Name</label>
                    <input className="input" placeholder="Jane" {...register('firstName', { required: true })} />
                  </div>
                  <div>
                    <label className="label">Last Name</label>
                    <input className="input" placeholder="Doe" {...register('lastName', { required: true })} />
                  </div>
                  <div className="col-span-2">
                    <label className="label">Address</label>
                    <input className="input" placeholder="123 Bold Street" {...register('address', { required: true })} />
                  </div>
                  <div className="col-span-2">
                    <label className="label">Apt, Suite, etc. (optional)</label>
                    <input className="input" placeholder="Unit 4B" {...register('address2')} />
                  </div>
                  <div>
                    <label className="label">City</label>
                    <input className="input" placeholder="Toronto" {...register('city', { required: true })} />
                  </div>
                  <div>
                    <label className="label">Province</label>
                    <select className="input" {...register('province', { required: true })}>
                      <option value="">Select Province</option>
                      {['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'].map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Postal Code</label>
                    <input className="input" placeholder="M5V 3L9" {...register('postalCode', { required: true })} />
                  </div>
                  <div>
                    <label className="label">Country</label>
                    <input className="input" defaultValue="Canada" {...register('country')} readOnly />
                  </div>
                </div>
              </div>

              {/* Payment — Stripe placeholder */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-lg">Payment</h2>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Lock size={12} /> Secured by Stripe
                  </div>
                </div>
                <div className="bg-brand-yellow/20 border-2 border-brand-yellow rounded-xl p-4 mb-4 text-sm text-amber-800">
                  <strong>🔧 Stripe integration coming soon!</strong> Enter any card details below to place a test order.
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="label">Card Number</label>
                    <input className="input font-mono" placeholder="4242 4242 4242 4242" {...register('cardNumber')} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Expiry</label>
                      <input className="input font-mono" placeholder="MM / YY" {...register('cardExpiry')} />
                    </div>
                    <div>
                      <label className="label">CVC</label>
                      <input className="input font-mono" placeholder="123" {...register('cardCvc')} />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={placing}
                className="btn-primary w-full justify-center text-base py-4 disabled:opacity-50"
              >
                <CreditCard size={20} />
                {placing ? 'Placing Order...' : `Pay ${formatPrice(orderTotal)}`}
              </button>
            </form>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="font-bold text-lg mb-4">Order Summary</h2>
              <div className="space-y-3 mb-5 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.variantId} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.image ? (
                        <Image src={item.image} alt={item.productName} fill className="object-cover" sizes="48px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">👕</div>
                      )}
                      <span className="absolute -top-1 -right-1 bg-brand-black text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{item.productName}</p>
                      <p className="text-[10px] text-gray-400">{item.color} / {item.size}</p>
                    </div>
                    <span className="text-xs font-bold">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax (HST)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2">
                  <span>Total</span>
                  <span className="text-brand-pink">{formatPrice(orderTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
