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

    const incomingVariants = (variants || []) as {
      color: string
      colorHex: string
      size: string
      stock: number
      sku?: string
    }[]

    // ── Images: delete all then recreate ──────────────────────────────────
    await prisma.productImage.deleteMany({ where: { productId: params.id } })

    // ── Variants: smart sync without $transaction (PgBouncer-safe) ────────
    // Fetch existing variants and check order history so we never delete
    // rows that OrderItems still reference (no cascade on that FK).
    const existingVariants = await prisma.productVariant.findMany({
      where: { productId: params.id },
      include: { orderItems: { take: 1 } },
    })

    const incomingKeys = new Set(incomingVariants.map((v) => `${v.color}|${v.size}`))
    const existingMap = new Map(existingVariants.map((v) => [`${v.color}|${v.size}`, v]))

    // Delete variants removed from the list that have no order history
    const toDeleteIds = existingVariants
      .filter((v) => !incomingKeys.has(`${v.color}|${v.size}`) && v.orderItems.length === 0)
      .map((v) => v.id)
    if (toDeleteIds.length > 0) {
      await prisma.productVariant.deleteMany({ where: { id: { in: toDeleteIds } } })
    }

    // Zero out removed variants that have order history (preserve for records)
    const toZeroIds = existingVariants
      .filter((v) => !incomingKeys.has(`${v.color}|${v.size}`) && v.orderItems.length > 0)
      .map((v) => v.id)
    if (toZeroIds.length > 0) {
      await prisma.productVariant.updateMany({
        where: { id: { in: toZeroIds } },
        data: { stock: 0 },
      })
    }

    // Update existing variants by their row ID (avoids compound-key upsert)
    // and create brand-new ones with a plain create
    for (const v of incomingVariants) {
      const key = `${v.color}|${v.size}`
      const stock = parseInt(String(v.stock)) || 0
      const colorHex = v.colorHex || '#000000'
      const existing = existingMap.get(key)

      if (existing) {
        await prisma.productVariant.update({
          where: { id: existing.id },
          data: { colorHex, stock, sku: v.sku || null },
        })
      } else {
        await prisma.productVariant.create({
          data: {
            productId: params.id,
            color: v.color,
            colorHex,
            size: v.size,
            stock,
            sku: v.sku || null,
          },
        })
      }
    }

    // ── Update core product fields + rebuild images ────────────────────────
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
          create: (images || []).map(
            (img: { url: string; alt?: string; color?: string; primary?: boolean }, i: number) => ({
              url: img.url,
              alt: img.alt || name,
              color: img.color || null,
              primary: i === 0,
              sortOrder: i,
            })
          ),
        },
      },
      include: { images: true, variants: true },
    })

    return NextResponse.json(product)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update product'
    console.error('[PUT /api/products/:id]', message)
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
