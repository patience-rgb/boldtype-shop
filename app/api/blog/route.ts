import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { slugify } from '@/lib/utils'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const all = searchParams.get('all')

  const posts = await prisma.blogPost.findMany({
    where: all === 'true' ? {} : { published: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(posts)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const user = session?.user as { role?: string; name?: string | null } | undefined
  if (!session || user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { title, excerpt, content, coverImage, tags, published } = body

  const slug = slugify(title) + '-' + Date.now().toString(36)

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      tags,
      published: published ?? false,
      publishedAt: published ? new Date() : null,
      authorName: user?.name || 'BoldType Team',
    },
  })

  return NextResponse.json(post, { status: 201 })
}
