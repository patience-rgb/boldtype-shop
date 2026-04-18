import { BlogForm } from '@/components/admin/BlogForm'

export const metadata = { title: 'New Blog Post' }

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="font-script text-3xl mb-6">write something bold. ✍️</h1>
      <BlogForm mode="create" />
    </div>
  )
}
