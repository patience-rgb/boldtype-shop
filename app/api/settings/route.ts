import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const ALLOWED_KEYS = [
  // Stripe
  'stripe_mode',
  'stripe_publishable_key_live',
  'stripe_secret_key_live',
  'stripe_webhook_secret_live',
  'stripe_publishable_key_test',
  'stripe_secret_key_test',
  'stripe_webhook_secret_test',
  // Shipping
  'shipping_provider',
  'shipengine_api_key',
  'easyship_api_key',
  'free_shipping_threshold',
  'default_shipping_rate',
  // Branding
  'logo_url',
  'favicon_url',
  // Announcement bar
  'announcement_visible',
  'announcement_text',
  'announcement_bg',
  // Hero content
  'hero_heading_1',
  'hero_heading_2',
  'hero_heading_3',
  'hero_subtitle',
  'hero_badge',
  'hero_bg_color',
]

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  const user = session?.user as { role?: string } | undefined
  if (!session || user?.role !== 'ADMIN') return null
  return session
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const settings = await prisma.storeSetting.findMany({
    where: { key: { in: ALLOWED_KEYS } },
  })

  const result: Record<string, string> = {}
  for (const s of settings) {
    // Mask secret keys in GET response
    if (s.key.includes('secret') || s.key.includes('api_key')) {
      result[s.key] = s.value ? '••••••••' + s.value.slice(-4) : ''
    } else {
      result[s.key] = s.value
    }
  }

  return NextResponse.json(result)
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()

  const updates: { key: string; value: string }[] = []
  for (const [key, value] of Object.entries(body)) {
    if (!ALLOWED_KEYS.includes(key)) continue
    // Skip masked values (user didn't change the field)
    if (typeof value === 'string' && value.startsWith('••••')) continue
    updates.push({ key, value: String(value) })
  }

  await Promise.all(
    updates.map((u) =>
      prisma.storeSetting.upsert({
        where: { key: u.key },
        update: { value: u.value },
        create: { key: u.key, value: u.value },
      })
    )
  )

  return NextResponse.json({ ok: true })
}
