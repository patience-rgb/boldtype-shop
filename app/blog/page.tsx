import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'
import { PenLine, FileText } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog — Style, Color & All Things Bold',
  description: 'Style tips, color guides and brand stories from BoldType.',
}

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
  })

  return (
    <div className="pt-[104px] min-h-screen">
      <div className="bg-brand-black py-12 px-4 text-center">
        <h1 className="font-script text-5xl text-white mb-2">the boldtype blog.</h1>
        <p className="text-gray-400 text-sm">Style drops, color wisdom & good vibes only.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <PenLine size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="font-script text-3xl text-gray-400 mb-2">posts coming soon!</h3>
            <p className="text-gray-400 text-sm">We&apos;re writing something bold for you. Stay tuned!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block card">
                <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-brand-pink/10 to-brand-purple/10">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><FileText size={48} className="text-gray-300" /></div>
                  )}
                </div>
                <div className="p-5">
                  {post.tags && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {post.tags.split(',').slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[10px] bg-brand-pink/10 text-brand-pink font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  <h2 className="font-bold text-base leading-snug group-hover:text-brand-pink transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h2>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{post.authorName || 'BoldType Team'}</span>
                    {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
