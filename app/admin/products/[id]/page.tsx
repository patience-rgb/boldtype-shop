import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ProductForm } from '@/components/admin/ProductForm'

type Props = { params: { id: string } }

export const metadata = { title: 'Edit Product' }

export default async function EditProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      variants: true,
    },
  })

  if (!product) notFound()

  const initialData = {
    id: product.id,
    name: product.name,
    description: product.description,
    details: product.details || '',
    category: product.category,
    basePrice: product.basePrice.toString(),
    salePrice: product.salePrice?.toString() || '',
    featured: product.featured,
    published: product.published,
    images: product.images.map((img) => ({ url: img.url, alt: img.alt || '', color: img.color || undefined })),
    variants: product.variants.map((v) => ({
      color: v.color,
      colorHex: v.colorHex,
      size: v.size,
      stock: v.stock,
      sku: v.sku || '',
    })),
  }

  return (
    <div>
      <h1 className="font-script text-3xl mb-6">editing: {product.name}</h1>
      <ProductForm mode="edit" initialData={initialData} />
    </div>
  )
}
