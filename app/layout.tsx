import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { CartDrawer } from '@/components/CartDrawer'
import { Providers } from '@/components/Providers'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: {
    default: 'BoldType. — Bold. Bright. Trend.',
    template: '%s | BoldType.',
  },
  description:
    'BoldType is your go-to for bright, bold apparel that makes a statement. T-shirts, hoodies & sweatshirts in head-turning colours. Find your power colour today.',
  keywords: ['bold fashion', 'bright hoodies', 'colourful t-shirts', 'sweatshirts', 'boldtype'],
  openGraph: {
    title: 'BoldType. — Bold. Bright. Trend.',
    description: 'Head-turning apparel in the boldest colours.',
    siteName: 'BoldType.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
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
