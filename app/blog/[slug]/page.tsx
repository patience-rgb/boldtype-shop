import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, User } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } })
  if (!post) return { title: 'Post Not Found' }
  return { title: post.title, description: post.excerpt }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } })
  if (!post || !post.published) notFound()

  return (
    <div className="pt-[104px] min-h-screen">
      {/* Hero */}
      <div className="relative bg-brand-black py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-brand-pink/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-purple/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          {post.tags && (
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {post.tags.split(',').map((tag) => (
                <span key={tag} className="text-xs bg-brand-pink/20 text-brand-pink font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
          <h1 className="font-bold text-3xl sm:text-4xl text-white mb-5 leading-tight">{post.title}</h1>
          <div className="flex items-center justify-center gap-4 text-gray-400 text-sm">
            <span className="flex items-center gap-1.5">
              <User size={14} /> {post.authorName || 'BoldType Team'}
            </span>
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar size={14} /> {formatDate(post.publishedAt)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Cover image */}
      {post.coverImage && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" sizes="800px" priority />
          </div>
        </div>
      )}

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-lg text-gray-600 font-medium mb-8 leading-relaxed border-l-4 border-brand-pink pl-4">
          {post.excerpt}
        </p>
        <div
          className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-brand-black prose-a:text-brand-pink prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
        />
      </article>

      {/* CTA */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
        <div className="bg-gradient-to-r from-brand-pink to-brand-purple rounded-3xl p-8 text-center text-white">
          <h3 className="font-script text-3xl mb-2">shop the bold life.</h3>
          <p className="text-white/80 text-sm mb-5">Inspired? Find pieces that match your power palette.</p>
          <Link href="/shop" className="bg-white text-brand-pink font-bold px-8 py-3 rounded-full inline-flex items-center gap-2 hover:bg-brand-yellow hover:text-brand-black transition-all">
            Shop Now →
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-pink transition-colors font-semibold">
          <ArrowLeft size={16} /> Back to Blog
        </Link>
      </div>
    </div>
  )
}
