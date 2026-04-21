import { BlogForm } from '@/components/admin/BlogForm'
import { PenLine } from 'lucide-react'

export const metadata = { title: 'New Blog Post' }

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="font-script text-3xl mb-6 flex items-center gap-2">write something bold. <PenLine size={28} /></h1>
      <BlogForm mode="create" />
    </div>
  )
}
