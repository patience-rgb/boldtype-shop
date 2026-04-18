import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const product = await prisma.product.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }] },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      variants: true,
    },
  })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    // Delete old images & variants, recreate
    await prisma.productImage.deleteMany({ where: { productId: params.id } })
    await prisma.productVariant.deleteMany({ where: { productId: params.id } })

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description,
        details,
        category,
        basePrice: parseFloat(basePrice),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        featured: featured ?? false,
        published: published ?? true,
        images: {
          create: (images || []).map((img: { url: string; alt?: string; primary?: boolean }, i: number) => ({
            url: img.url,
            alt: img.alt || name,
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

    return NextResponse.json(product)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  const user = session?.user as { role?: string } | undefined
  if (!session || user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await prisma.product.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
