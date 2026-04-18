'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItemLocal = {
  id: string
  variantId: string
  productId: string
  productName: string
  productSlug: string
  color: string
  colorHex: string
  size: string
  price: number
  image: string
  quantity: number
}

type CartStore = {
  items: CartItemLocal[]
  isOpen: boolean
  addItem: (item: CartItemLocal) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  get total(): number
  get count(): number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.variantId === item.variantId)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
              isOpen: true,
            }
          }
          return { items: [...state.items, item], isOpen: true }
        }),

      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        })),

      updateQuantity: (variantId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.variantId !== variantId)
              : state.items.map((i) =>
                  i.variantId === variantId ? { ...i, quantity } : i
                ),
        })),

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      get total() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      },
      get count() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },
    }),
    { name: 'boldtype-cart' }
  )
)

type WishlistStore = {
  productIds: string[]
  toggle: (productId: string) => void
  has: (productId: string) => boolean
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      productIds: [],
      toggle: (productId) =>
        set((state) => ({
          productIds: state.productIds.includes(productId)
            ? state.productIds.filter((id) => id !== productId)
            : [...state.productIds, productId],
        })),
      has: (productId) => get().productIds.includes(productId),
    }),
    { name: 'boldtype-wishlist' }
  )
)
