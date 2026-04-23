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

    const incomingVariants = (variants || []) as { color: string; colorHex: string; size: string; stock: number; sku?: string }[]

    const product = await prisma.$transaction(async (tx) => {
      // Bypass RLS for admin operations — postgres role must have BYPASSRLS or be table owner
      await tx.$executeRaw`SET LOCAL row_security = off`

      // Rebuild images
      await tx.productImage.deleteMany({ where: { productId: params.id } })

      // Upsert variants — avoid deleting rows referenced by OrderItems (no cascade on that relation)
      const existingVariants = await tx.productVariant.findMany({
        where: { productId: params.id },
        include: { orderItems: { take: 1 } },
      })
      const incomingKeys = new Set(incomingVariants.map((v) => `${v.color}|${v.size}`))

      // Delete only variants not in the new list that have no order history
      const toDelete = existingVariants
        .filter((v) => !incomingKeys.has(`${v.color}|${v.size}`) && v.orderItems.length === 0)
        .map((v) => v.id)
      if (toDelete.length > 0) {
        await tx.productVariant.deleteMany({ where: { id: { in: toDelete } } })
      }

      // Zero out removed variants that have order history (keep rows for order record integrity)
      const toZero = existingVariants
        .filter((v) => !incomingKeys.has(`${v.color}|${v.size}`) && v.orderItems.length > 0)
        .map((v) => v.id)
      if (toZero.length > 0) {
        await tx.productVariant.updateMany({ where: { id: { in: toZero } }, data: { stock: 0 } })
      }

      // Upsert each incoming variant
      for (const v of incomingVariants) {
        await tx.productVariant.upsert({
          where: { productId_color_size: { productId: params.id, color: v.color, size: v.size } },
          create: {
            productId: params.id,
            color: v.color,
            colorHex: v.colorHex || '#000000',
            size: v.size,
            stock: parseInt(v.stock as unknown as string) || 0,
            sku: v.sku || null,
          },
          update: {
            colorHex: v.colorHex || '#000000',
            stock: parseInt(v.stock as unknown as string) || 0,
            sku: v.sku || null,
          },
        })
      }

      return tx.product.update({
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
            create: (images || []).map((img: { url: string; alt?: string; color?: string; primary?: boolean }, i: number) => ({
              url: img.url,
              alt: img.alt || name,
              color: img.color || null,
              primary: i === 0,
              sortOrder: i,
            })),
          },
        },
        include: { images: true, variants: true },
      })
    })

    return NextResponse.json(product)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update product'
    console.error('[PUT /api/products]', message)
    return NextResponse.json({ error: message }, { status: 500 })
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
