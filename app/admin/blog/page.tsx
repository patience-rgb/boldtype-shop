import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Edit, Eye, EyeOff, PenLine } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { DeleteBlogButton } from '@/components/admin/DeleteBlogButton'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Blog' }

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-script text-3xl">blog.</h1>
          <p className="text-gray-500 text-sm mt-0.5">{posts.length} posts total</p>
        </div>
        <Link href="/admin/blog/new" className="btn-primary text-sm py-2.5 px-5">
          <Plus size={16} /> New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm">
          <PenLine size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="font-script text-2xl text-gray-400 mb-2">nothing written yet!</h3>
          <Link href="/admin/blog/new" className="btn-primary">
            <Plus size={16} /> Write First Post
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm truncate">{post.title}</p>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-1">{post.excerpt}</p>
                  <div className="flex items-center gap-3 mt-1">
                    {post.tags && post.tags.split(',').slice(0, 2).map((tag) => (
                      <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        {tag.trim()}
                      </span>
                    ))}
                    {post.publishedAt && (
                      <span className="text-[10px] text-gray-400">{formatDate(post.publishedAt)}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1 text-xs font-semibold ${post.published ? 'text-green-600' : 'text-gray-400'}`}>
                    {post.published ? <Eye size={12} /> : <EyeOff size={12} />}
                    <span className="hidden sm:inline">{post.published ? 'Live' : 'Draft'}</span>
                  </span>
                  <Link href={`/admin/blog/${post.id}`} className="p-2 text-gray-400 hover:text-brand-purple transition-colors">
                    <Edit size={15} />
                  </Link>
                  {post.published && (
                    <Link href={`/blog/${post.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-brand-blue transition-colors">
                      <Eye size={15} />
                    </Link>
                  )}
                  <DeleteBlogButton id={post.id} title={post.title} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
