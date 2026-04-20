import { ProductForm } from '@/components/admin/ProductForm'
import { Package } from 'lucide-react'

export const metadata = { title: 'Add Product' }

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-script text-3xl mb-6 flex items-center gap-2">add a new product. <Package size={28} /></h1>
      <ProductForm mode="create" />
    </div>
  )
}
