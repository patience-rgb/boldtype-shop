import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  const user = session?.user as { role?: string; id?: string } | undefined

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const where = user?.role === 'ADMIN' ? {} : { userId: user?.id }

  const orders = await prisma.order.findMany({
    where,
    include: {
      items: {
        include: {
          product: { include: { images: { where: { primary: true } } } },
        },
      },
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(orders)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, guestEmail, shippingAddress, subtotal, shippingCost, tax, total } = body

    const session = await getServerSession(authOptions)
    const user = session?.user as { id?: string } | undefined

    const order = await prisma.order.create({
      data: {
        userId: user?.id || null,
        guestEmail: !user?.id ? guestEmail : null,
        status: 'PENDING',
        subtotal,
        shippingCost: shippingCost || 0,
        tax: tax || 0,
        total,
        shippingAddress: JSON.stringify(shippingAddress),
        items: {
          create: items.map((item: { variantId: string; productId: string; quantity: number; price: number; color: string; size: string }) => ({
            variantId: item.variantId,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            color: item.color,
            size: item.size,
          })),
        },
      },
      include: { items: true },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
