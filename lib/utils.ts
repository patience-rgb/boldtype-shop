import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(price)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function getEffectivePrice(basePrice: number, salePrice?: number | null): number {
  return salePrice !== null && salePrice !== undefined && salePrice < basePrice
    ? salePrice
    : basePrice
}

export function isOnSale(basePrice: number, salePrice?: number | null): boolean {
  return salePrice !== null && salePrice !== undefined && salePrice < basePrice
}

export const CATEGORIES = [
  { value: 'TSHIRT', label: 'T-Shirts', slug: 'tshirts' },
  { value: 'HOODIE', label: 'Hoodies', slug: 'hoodies' },
  { value: 'SWEATSHIRT', label: 'Sweatshirts', slug: 'sweatshirts' },
] as const

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const

export const ORDER_STATUSES = [
  { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'PAID', label: 'Paid', color: 'bg-blue-100 text-blue-800' },
  { value: 'PROCESSING', label: 'Processing', color: 'bg-purple-100 text-purple-800' },
  { value: 'SHIPPED', label: 'Shipped', color: 'bg-orange-100 text-orange-800' },
  { value: 'DELIVERED', label: 'Delivered', color: 'bg-green-100 text-green-800' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  { value: 'REFUNDED', label: 'Refunded', color: 'bg-gray-100 text-gray-800' },
] as const

export const COLOR_RECOMMENDATIONS = {
  WARM: {
    vibe: 'Warm',
    emoji: '🔥',
    title: 'Golden Hues & Fiery Brights',
    description: 'Your skin has a natural golden filter. Lean into colors that share this yellow base.',
    colors: [
      {
        name: 'Bright Yellow',
        hex: '#FFD600',
        why: 'Your natural golden tone is amplified by yellow-based pigments. Go for max saturation — these colors make you glow.',
        tags: ['Marigold', 'Sunny'],
      },
      {
        name: 'Kelly Green',
        hex: '#4CAF50',
        why: 'This shade contains a yellow infusion, giving you a striking contrast while remaining harmonious.',
        tags: ['Yellow-Based'],
      },
      {
        name: 'Hot Pink / Coral',
        hex: '#FF6B6B',
        why: 'Choose warm, yellow-based reds like Crimson and Cherry Red. Avoid anything too blue.',
        tags: ['Coral', 'Orange-Based'],
      },
    ],
  },
  COOL: {
    vibe: 'Cool',
    emoji: '❄️',
    title: 'Rich Jewel Tones & Icy Pops',
    description: "Your skin has a pink/blue base. You thrive in deep, striking colors that have a cool foundation.",
    colors: [
      {
        name: 'Electric Blue',
        hex: '#00A3E0',
        why: 'The ultimate power color for cool tones. This deep, sapphire blue enhances your natural blue/pink undertone and makes your features pop.',
        tags: ['Bright', 'Sapphire'],
      },
      {
        name: 'Deep Violet',
        hex: '#5C00D8',
        why: 'Jewel Tones are your strength. This blue-based purple creates maximum contrast and looks rich against your skin.',
        tags: ['Amethyst', 'Plum'],
      },
      {
        name: 'Hot Pink / Fuchsia',
        hex: '#FF3E8E',
        why: 'Blue-based pinks are mandatory. This provides a vibrant, cool pop. Avoid yellow-based reds and orange.',
        tags: ['Fuchsia', 'Magenta'],
      },
    ],
  },
  NEUTRAL: {
    vibe: 'Neutral',
    emoji: '✨',
    title: 'Balanced Brights & Dual Tones',
    description: "You can borrow from both Warm and Cool palettes. Focus on true, clear colors and strategic contrast.",
    colors: [
      {
        name: 'Kelly Green',
        hex: '#3DAA5A',
        why: 'Medium-saturation universal colors like Jade and Lagoon Blue work best — they don\'t pull your balanced undertone too far.',
        tags: ['Medium', 'Jade'],
      },
      {
        name: 'Electric Blue',
        hex: '#4A90D9',
        why: "Look for Cornflower Blue or Lagoon Blue — clear, non-icy shades that still deliver impact.",
        tags: ['Cornflower', 'Lagoon'],
      },
      {
        name: 'Black & White Contrast',
        hex: '#0A0A0A',
        why: "Use high-contrast anchors like True Black and Optic White. Pairing bold colors with these staples maximizes your impact.",
        tags: ['True Black', 'Optic White'],
      },
    ],
  },
}
