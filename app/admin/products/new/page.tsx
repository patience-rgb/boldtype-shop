import { ProductForm } from '@/components/admin/ProductForm'

export const metadata = { title: 'Add Product' }

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-script text-3xl mb-6">add a new product. 📦</h1>
      <ProductForm mode="create" />
    </div>
  )
}
