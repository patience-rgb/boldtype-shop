export type ProductWithRelations = {
  id: string
  name: string
  slug: string
  description: string
  details?: string | null
  category: string
  basePrice: number
  salePrice?: number | null
  featured: boolean
  published: boolean
  createdAt: Date
  updatedAt: Date
  images: ProductImage[]
  variants: ProductVariant[]
}

export type ProductImage = {
  id: string
  url: string
  alt?: string | null
  primary: boolean
  sortOrder: number
  productId: string
}

export type ProductVariant = {
  id: string
  color: string
  colorHex: string
  size: string
  stock: number
  sku?: string | null
  productId: string
}

export type BlogPostType = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string | null
  tags?: string | null
  published: boolean
  publishedAt?: Date | null
  authorId?: string | null
  authorName?: string | null
  createdAt: Date
  updatedAt: Date
}

export type OrderWithItems = {
  id: string
  userId?: string | null
  guestEmail?: string | null
  status: string
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  stripePaymentId?: string | null
  shippingAddress?: string | null
  trackingNumber?: string | null
  notes?: string | null
  createdAt: Date
  updatedAt: Date
  items: OrderItemType[]
  user?: { name?: string | null; email: string } | null
}

export type OrderItemType = {
  id: string
  quantity: number
  price: number
  color: string
  size: string
  product: { name: string; images: ProductImage[] }
}

export type ShippingAddress = {
  firstName: string
  lastName: string
  address: string
  address2?: string
  city: string
  province: string
  postalCode: string
  country: string
  phone: string
}
