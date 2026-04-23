import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { slugify } from '@/lib/utils'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')
  const published = searchParams.get('published')
  const search = searchParams.get('q')
  const sale = searchParams.get('sale')

  const where: Record<string, unknown> = {}
  if (category) where.category = category.toUpperCase()
  if (featured === 'true') where.featured = true
  if (published !== 'all') where.published = true
  if (sale === 'true') where.salePrice = { not: null }
  if (search) where.name = { contains: search }

  const products = await prisma.product.findMany({
    where,
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      variants: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const user = session?.user as { role?: string } | undefined
  if (!session || user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const {
      name,
      description,
      details,
      category,
      basePrice,
      salePrice,
      featured,
      published,
      images,
      variants,
    } = body

    const slug = slugify(name) + '-' + Date.now().toString(36)

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        details,
        category,
        basePrice: parseFloat(basePrice),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        featured: featured ?? false,
        published: published ?? true,
        images: {
          create: (images || []).map((img: { url: string; alt?: string; color?: string; primary?: boolean; sortOrder?: number }, i: number) => ({
            url: img.url,
            alt: img.alt || name,
            color: img.color || null,
            primary: i === 0,
            sortOrder: i,
          })),
        },
        variants: {
          create: (variants || []).map((v: { color: string; colorHex: string; size: string; stock: number; sku?: string }) => ({
            color: v.color,
            colorHex: v.colorHex || '#000000',
            size: v.size,
            stock: parseInt(v.stock as unknown as string) || 0,
            sku: v.sku,
          })),
        },
      },
      include: { images: true, variants: true },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create product'
    console.error('[POST /api/products]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
