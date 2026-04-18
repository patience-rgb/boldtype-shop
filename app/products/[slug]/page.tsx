import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ProductDetailClient } from '@/components/ProductDetailClient'
import { ProductCard } from '@/components/ProductCard'
import type { ProductWithRelations } from '@/types'
import type { Metadata } from 'next'

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } })
  if (!product) return { title: 'Product Not Found' }
  return { title: product.name, description: product.description }
}

export default async function ProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      variants: true,
    },
  })

  if (!product || !product.published) notFound()

  const related: ProductWithRelations[] = await prisma.product.findMany({
    where: {
      category: product.category,
      published: true,
      NOT: { id: product.id },
    },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      variants: true,
    },
    take: 4,
  })

  return (
    <div className="pt-[104px]">
      <ProductDetailClient product={product} />

      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="section-heading mb-6">you might also like.</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
