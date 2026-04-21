import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, Eye, EyeOff, Package } from 'lucide-react'
import { TShirtIcon } from '@/components/icons/ClothingIcons'
import { formatPrice } from '@/lib/utils'
import { DeleteProductButton } from '@/components/admin/DeleteProductButton'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Products' }

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      images: { where: { primary: true } },
      variants: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  const totalStock = (variants: { stock: number }[]) =>
    variants.reduce((sum, v) => sum + v.stock, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-script text-3xl">products.</h1>
          <p className="text-gray-500 text-sm mt-0.5">{products.length} total products</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary text-sm py-2.5 px-5">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm">
          <Package size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="font-script text-2xl text-gray-400 mb-2">no products yet!</h3>
          <p className="text-gray-400 text-sm mb-6">Add your first bold product to get started.</p>
          <Link href="/admin/products/new" className="btn-primary">
            <Plus size={16} /> Add First Product
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Category</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Stock</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          {product.images[0] ? (
                            <Image src={product.images[0].url} alt={product.name} fill className="object-cover" sizes="48px" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><TShirtIcon className="w-8 h-8 text-gray-400" /></div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-semibold capitalize">
                        {product.category.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-bold text-sm">{formatPrice(product.basePrice)}</p>
                        {product.salePrice && (
                          <p className="text-xs text-brand-pink font-semibold">{formatPrice(product.salePrice)} sale</p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className={`text-xs font-bold ${totalStock(product.variants) === 0 ? 'text-red-500' : totalStock(product.variants) <= 5 ? 'text-amber-500' : 'text-green-600'}`}>
                        {totalStock(product.variants)} units
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`flex items-center gap-1.5 text-xs font-bold ${product.published ? 'text-green-600' : 'text-gray-400'}`}>
                        {product.published ? <Eye size={12} /> : <EyeOff size={12} />}
                        {product.published ? 'Live' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/products/${product.id}`} className="p-2 text-gray-400 hover:text-brand-purple transition-colors" title="Edit">
                          <Edit size={15} />
                        </Link>
                        <Link href={`/products/${product.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-brand-blue transition-colors" title="View">
                          <Eye size={15} />
                        </Link>
                        <DeleteProductButton id={product.id} name={product.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
