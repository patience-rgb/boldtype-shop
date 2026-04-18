import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export const metadata = { title: { default: 'Admin', template: '%s | Admin — BoldType.' } }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  const user = session?.user as { role?: string } | undefined

  if (!session || user?.role !== 'ADMIN') {
    redirect('/auth/signin?callbackUrl=/admin')
  }

  return (
    <div className="flex min-h-screen pt-[72px] bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 ml-0 lg:ml-64 p-6 lg:p-8">{children}</main>
    </div>
  )
}
