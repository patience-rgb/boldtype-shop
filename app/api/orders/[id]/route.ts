import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const user = session?.user as { role?: string } | undefined
  if (!session || user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { status, trackingNumber } = await req.json()

  const order = await prisma.order.update({
    where: { id: params.id },
    data: { status, ...(trackingNumber && { trackingNumber }) },
  })

  return NextResponse.json(order)
}
