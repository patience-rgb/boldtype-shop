import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { TShirtIcon } from '@/components/icons/ClothingIcons'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Search' }

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q?.trim() || ''

  const products = query
    ? await prisma.product.findMany({
        where: {
          published: true,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: { images: { where: { primary: true } } },
        take: 20,
      })
    : []

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-script text-4xl mb-6">search.</h1>
        <form method="GET" className="mb-8">
          <div className="flex gap-3">
            <input
              name="q"
              defaultValue={query}
              placeholder="Search products..."
              className="input flex-1"
              autoFocus
            />
            <button type="submit" className="btn-primary">Search</button>
          </div>
        </form>

        {query && (
          <p className="text-gray-500 text-sm mb-6">
            {products.length} result{products.length !== 1 ? 's' : ''} for &quot;{query}&quot;
          </p>
        )}

        {products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {products.map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`} className="card group">
                <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                  {p.images[0] ? (
                    <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <TShirtIcon className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <div className="p-4">
                  <p className="font-semibold text-sm">{p.name}</p>
                  <p className="text-brand-pink font-bold text-sm mt-1">{formatPrice(p.basePrice)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
