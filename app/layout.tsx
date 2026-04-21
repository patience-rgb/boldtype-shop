import type { Metadata } from 'next'
import { Pacifico, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { AnnouncementBar } from '@/components/AnnouncementBar'
import { Footer } from '@/components/Footer'
import { CartDrawer } from '@/components/CartDrawer'
import { Providers } from '@/components/Providers'
import { Toaster } from 'sonner'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pacifico',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

async function getSiteSettings() {
  try {
    const rows = await prisma.storeSetting.findMany({
      where: { key: { in: ['logo_url', 'favicon_url', 'announcement_visible', 'announcement_text', 'announcement_bg'] } },
    })
    const map: Record<string, string> = {}
    for (const r of rows) map[r.key] = r.value
    return map
  } catch {
    return {} as Record<string, string>
  }
}

export async function generateMetadata(): Promise<Metadata> {
  let faviconUrl: string | undefined
  try {
    const setting = await prisma.storeSetting.findUnique({ where: { key: 'favicon_url' } })
    if (setting?.value) faviconUrl = setting.value
  } catch { /* fall through to default */ }

  return {
    title: {
      default: 'BoldType. — Bold. Bright. Trend.',
      template: '%s | BoldType.',
    },
    description:
      'BoldType is your go-to for bright, bold apparel that makes a statement. T-shirts, hoodies & sweatshirts in head-turning colors. Find your power color today.',
    keywords: ['bold fashion', 'bright hoodies', 'colorful t-shirts', 'sweatshirts', 'boldtype'],
    openGraph: {
      title: 'BoldType. — Bold. Bright. Trend.',
      description: 'Head-turning apparel in the boldest colors.',
      siteName: 'BoldType.',
    },
    icons: faviconUrl ? { icon: faviconUrl } : undefined,
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettings()

  return (
    <html lang="en" className={`${pacifico.variable} ${spaceGrotesk.variable}`}>
      <body>
        <Providers>
          <AnnouncementBar
            visible={settings.announcement_visible !== 'false'}
            text={settings.announcement_text || ''}
            bg={settings.announcement_bg || ''}
          />
          <Navbar logoUrl={settings.logo_url || ''} />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartDrawer />
          <Toaster
            position="top-right"
            toastOptions={{
              style: { fontFamily: 'var(--font-space-grotesk)' },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
