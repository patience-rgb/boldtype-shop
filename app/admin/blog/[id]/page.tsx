import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { BlogForm } from '@/components/admin/BlogForm'

type Props = { params: { id: string } }

export const metadata = { title: 'Edit Blog Post' }

export default async function EditBlogPostPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({ where: { id: params.id } })
  if (!post) notFound()

  return (
    <div>
      <h1 className="font-script text-3xl mb-6">editing: {post.title}</h1>
      <BlogForm
        mode="edit"
        initialData={{
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage || '',
          tags: post.tags || '',
          published: post.published,
        }}
      />
    </div>
  )
}
