import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { slugify } from '@/lib/utils'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const post = await prisma.blogPost.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }] },
  })
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const user = session?.user as { role?: string } | undefined
  if (!session || user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { title, excerpt, content, coverImage, tags, published } = body

  const existing = await prisma.blogPost.findUnique({ where: { id: params.id } })
  const wasPublished = existing?.published

  const post = await prisma.blogPost.update({
    where: { id: params.id },
    data: {
      title,
      slug: slugify(title) + '-' + params.id.slice(-4),
      excerpt,
      content,
      coverImage,
      tags,
      published,
      publishedAt: published && !wasPublished ? new Date() : existing?.publishedAt,
    },
  })

  return NextResponse.json(post)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const user = session?.user as { role?: string } | undefined
  if (!session || user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await prisma.blogPost.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
