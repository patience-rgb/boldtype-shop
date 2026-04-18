import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/ProductCard'
import { ShopFilters } from '@/components/ShopFilters'
import type { ProductWithRelations } from '@/types'

export const metadata = { title: 'Shop All' }

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string; filter?: string; q?: string }
}) {
  const where: Record<string, unknown> = { published: true }

  if (searchParams.category) {
    where.category = searchParams.category.toUpperCase()
  }
  if (searchParams.filter === 'sale') {
    where.salePrice = { not: null }
  }
  if (searchParams.q) {
    where.name = { contains: searchParams.q }
  }

  const orderBy =
    searchParams.sort === 'price-asc'
      ? { basePrice: 'asc' as const }
      : searchParams.sort === 'price-desc'
      ? { basePrice: 'desc' as const }
      : { createdAt: 'desc' as const }

  const products: ProductWithRelations[] = await prisma.product.findMany({
    where,
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      variants: true,
    },
    orderBy,
  })

  const categories = [
    { value: '', label: 'All' },
    { value: 'tshirt', label: 'T-Shirts' },
    { value: 'hoodie', label: 'Hoodies' },
    { value: 'sweatshirt', label: 'Sweatshirts' },
  ]

  return (
    <div className="pt-[104px] min-h-screen">
      {/* Header */}
      <div className="bg-brand-black py-12 px-4 text-center">
        <h1 className="font-script text-5xl text-white mb-2">
          {searchParams.filter === 'sale'
            ? '🔥 on sale.'
            : searchParams.q
            ? `search: "${searchParams.q}"`
            : 'shop all.'}
        </h1>
        <p className="text-gray-400 text-sm">
          {products.length} {products.length === 1 ? 'piece' : 'pieces'} of pure boldness
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ShopFilters
          categories={categories}
          activeCategory={searchParams.category || ''}
          activeSort={searchParams.sort || ''}
          isSale={searchParams.filter === 'sale'}
        />

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">👀</p>
            <h3 className="font-script text-3xl text-gray-400 mb-2">nothing here yet!</h3>
            <p className="text-gray-400 text-sm">Try a different filter or check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
