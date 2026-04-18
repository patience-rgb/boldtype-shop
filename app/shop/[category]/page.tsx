import { redirect } from 'next/navigation'
import { CATEGORIES } from '@/lib/utils'

type Props = { params: { category: string } }

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }))
}

export default function CategoryPage({ params }: Props) {
  const cat = CATEGORIES.find((c) => c.slug === params.category)
  if (!cat) redirect('/shop')
  redirect(`/shop?category=${params.category}`)
}
