'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Upload, X, GripVertical, Eye, EyeOff } from 'lucide-react'
import { cn, CATEGORIES, SIZES } from '@/lib/utils'
import { toast } from 'sonner'
import Image from 'next/image'

type Variant = {
  color: string
  colorHex: string
  size: string
  stock: number
  sku?: string
}

type ProductFormData = {
  name: string
  description: string
  details: string
  category: string
  basePrice: string
  salePrice: string
  featured: boolean
  published: boolean
  images: { url: string; alt: string; color?: string }[]
  variants: Variant[]
}

type Props = {
  initialData?: Partial<ProductFormData> & { id?: string }
  mode: 'create' | 'edit'
}

const DEFAULT_FORM: ProductFormData = {
  name: '',
  description: '',
  details: '',
  category: 'TSHIRT',
  basePrice: '',
  salePrice: '',
  featured: false,
  published: true,
  images: [],
  variants: [],
}

export function ProductForm({ initialData, mode }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<ProductFormData>({
    ...DEFAULT_FORM,
    ...initialData,
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newVariant, setNewVariant] = useState<Variant>({
    color: '',
    colorHex: '#000000',
    size: 'M',
    stock: 0,
    sku: '',
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const compressImage = (file: File, maxPx = 1400, quality = 0.82): Promise<File> =>
    new Promise((resolve, reject) => {
      const img = new window.Image()
      img.onload = () => {
        let { width, height } = img
        if (width > maxPx || height > maxPx) {
          if (width >= height) { height = Math.round((height * maxPx) / width); width = maxPx }
          else { width = Math.round((width * maxPx) / height); height = maxPx }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => blob
            ? resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }))
            : reject(new Error('Compression failed')),
          'image/jpeg', quality
        )
        URL.revokeObjectURL(img.src)
      }
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })

  const handleImageUpload = async (files: FileList) => {
    setUploading(true)
    const uploaded: { url: string; alt: string }[] = []

    for (const file of Array.from(files)) {
      try {
        const compressed = await compressImage(file)
        const fd = new FormData()
        fd.append('file', compressed)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        if (!res.ok) throw new Error('Upload failed')
        const { url } = await res.json()
        uploaded.push({ url, alt: form.name || file.name })
      } catch {
        toast.error(`Failed to upload ${file.name}`)
      }
    }

    setForm((f) => ({ ...f, images: [...f.images, ...uploaded] }))
    setUploading(false)
    if (uploaded.length > 0) toast.success(`${uploaded.length} image(s) uploaded!`)
  }

  const removeImage = (index: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }))
  }

  const addVariant = () => {
    if (!newVariant.color) return toast.error('Enter a colour name')
    setForm((f) => ({ ...f, variants: [...f.variants, { ...newVariant }] }))
    setNewVariant({ color: '', colorHex: '#000000', size: 'M', stock: 0, sku: '' })
  }

  const removeVariant = (index: number) => {
    setForm((f) => ({ ...f, variants: f.variants.filter((_, i) => i !== index) }))
  }

  const updateVariant = (index: number, field: keyof Variant, value: string | number) => {
    setForm((f) => ({
      ...f,
      variants: f.variants.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name) return toast.error('Product name is required')
    if (!form.basePrice) return toast.error('Base price is required')

    setSaving(true)
    try {
      const url = mode === 'edit' ? `/api/products/${initialData?.id}` : '/api/products'
      const method = mode === 'edit' ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to save')
      }

      toast.success(mode === 'edit' ? 'Product updated!' : 'Product created!')
      router.push('/admin/products')
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Basic Info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-base mb-5">Product Information</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label">Product Name *</label>
            <input
              className="input"
              placeholder="e.g. BT Logo Hoodie"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Description *</label>
            <textarea
              className="input resize-none h-24"
              placeholder="Tell shoppers what makes this piece bold..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Product Details / Care Instructions</label>
            <textarea
              className="input resize-none h-20"
              placeholder="e.g. 80% cotton, 20% polyester. Machine wash cold..."
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Category *</label>
            <select
              className="input"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-base mb-5">Pricing</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Base Price (CAD) *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
              <input
                className="input pl-7"
                type="number"
                step="0.01"
                min="0"
                placeholder="45.00"
                value={form.basePrice}
                onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <label className="label">Sale Price (CAD)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
              <input
                className="input pl-7"
                type="number"
                step="0.01"
                min="0"
                placeholder="Optional"
                value={form.salePrice}
                onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Leave blank for no sale</p>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-base mb-5">Product Images</h2>
        <div
          className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:border-brand-pink transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDrop={(e) => { e.preventDefault(); handleImageUpload(e.dataTransfer.files) }}
          onDragOver={(e) => e.preventDefault()}
        >
          <Upload size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm font-semibold text-gray-500">Drop images here or click to upload</p>
          <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP up to 10MB each</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
          />
        </div>
        {uploading && (
          <div className="mt-3 text-sm text-brand-pink font-semibold text-center">Uploading...</div>
        )}
        {form.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
            {form.images.map((img, i) => {
              const variantColors = Array.from(new Set(form.variants.map((v) => v.color).filter(Boolean)))
              return (
                <div key={i} className="relative group rounded-xl overflow-hidden bg-gray-100">
                  <div className="aspect-square relative">
                    <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="160px" />
                    {i === 0 && (
                      <div className="absolute top-1 left-1 bg-brand-pink text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        PRIMARY
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  {/* Colour tag */}
                  <div className="p-1.5 bg-white border-t border-gray-100">
                    <select
                      className="w-full text-[11px] text-gray-600 border border-gray-200 rounded-lg px-1.5 py-1 focus:outline-none focus:border-brand-pink"
                      value={img.color || ''}
                      onChange={(e) => setForm((f) => ({ ...f, images: f.images.map((im, idx) => idx === i ? { ...im, color: e.target.value || undefined } : im) }))}
                    >
                      <option value="">All colours</option>
                      {variantColors.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        <p className="text-xs text-gray-400 mt-2">First image is the primary. Tag each image with a colour so it auto-switches when a shopper picks that variant.</p>
      </div>

      {/* Variants */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-base mb-2">Variants (Colour × Size)</h2>
        <p className="text-xs text-gray-400 mb-5">Add each colour/size combination with individual stock levels.</p>

        {/* Existing variants */}
        {form.variants.length > 0 && (
          <div className="space-y-2 mb-5">
            <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">
              <span className="col-span-1" />
              <span className="col-span-3">Colour</span>
              <span className="col-span-2">Size</span>
              <span className="col-span-2">Stock</span>
              <span className="col-span-3">SKU</span>
              <span className="col-span-1" />
            </div>
            {form.variants.map((v, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center bg-gray-50 rounded-xl p-2">
                <div className="col-span-1 flex items-center gap-1">
                  <div className="w-5 h-5 rounded-full border border-gray-300" style={{ background: v.colorHex }} />
                </div>
                <input
                  className="col-span-3 input text-xs py-1.5"
                  value={v.color}
                  onChange={(e) => updateVariant(i, 'color', e.target.value)}
                />
                <select
                  className="col-span-2 input text-xs py-1.5"
                  value={v.size}
                  onChange={(e) => updateVariant(i, 'size', e.target.value)}
                >
                  {SIZES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <input
                  className="col-span-2 input text-xs py-1.5"
                  type="number"
                  min="0"
                  value={v.stock}
                  onChange={(e) => updateVariant(i, 'stock', parseInt(e.target.value) || 0)}
                />
                <input
                  className="col-span-3 input text-xs py-1.5"
                  placeholder="SKU (optional)"
                  value={v.sku || ''}
                  onChange={(e) => updateVariant(i, 'sku', e.target.value)}
                />
                <button type="button" onClick={() => removeVariant(i)} className="col-span-1 text-red-400 hover:text-red-600 transition-colors flex items-center justify-center">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add variant */}
        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4">
          <p className="text-xs font-bold text-gray-500 mb-3">Add Variant</p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="sm:col-span-2">
              <label className="label text-xs">Colour Name</label>
              <input
                className="input text-sm"
                placeholder="e.g. Electric Blue"
                value={newVariant.color}
                onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })}
              />
            </div>
            <div>
              <label className="label text-xs">Colour Hex</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  className="w-10 h-10 rounded-lg border-2 border-gray-200 cursor-pointer p-0.5"
                  value={newVariant.colorHex}
                  onChange={(e) => setNewVariant({ ...newVariant, colorHex: e.target.value })}
                />
                <input
                  className="input text-sm font-mono flex-1"
                  value={newVariant.colorHex}
                  onChange={(e) => setNewVariant({ ...newVariant, colorHex: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="label text-xs">Size</label>
              <select className="input text-sm" value={newVariant.size} onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}>
                {SIZES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label text-xs">Stock Qty</label>
              <input
                className="input text-sm"
                type="number"
                min="0"
                value={newVariant.stock}
                onChange={(e) => setNewVariant({ ...newVariant, stock: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={addVariant}
            className="mt-3 flex items-center gap-2 text-sm font-bold text-brand-purple hover:text-purple-800 transition-colors"
          >
            <Plus size={16} /> Add This Variant
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-base mb-4">Visibility</h2>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 accent-brand-pink rounded"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            <div>
              <p className="font-semibold text-sm">Published</p>
              <p className="text-xs text-gray-400">Visible to customers</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 accent-brand-yellow rounded"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            <div>
              <p className="font-semibold text-sm">Featured</p>
              <p className="text-xs text-gray-400">Show on homepage</p>
            </div>
          </label>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? 'Saving...' : mode === 'edit' ? 'Update Product' : 'Create Product'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline">
          Cancel
        </button>
      </div>
    </form>
  )
}
