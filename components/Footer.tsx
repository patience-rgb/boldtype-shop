import Link from 'next/link'
import { Instagram, Twitter, Youtube, Flame, Sparkles, Heart } from 'lucide-react'
import { NewsletterForm } from '@/components/NewsletterForm'

export function Footer() {
  return (
    <footer className="bg-brand-black text-white">
      {/* Newsletter bar */}
      <div className="bg-brand-pink py-10 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="font-script text-3xl mb-2">stay in the loop.</h3>
          <p className="text-white/90 text-sm mb-5">
            New drops, bold inspo, and color tips — straight to your inbox. No boring stuff, promise.
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="font-script text-3xl text-brand-pink">boldtype.</span>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              Bold. Bright. Trend. Wear your vibe, own your color.
            </p>
            <div className="flex gap-3 mt-4">
              {[
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Twitter, href: '#', label: 'Twitter/X' },
                { Icon: Youtube, href: '#', label: 'YouTube' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-brand-pink hover:text-brand-pink transition-colors"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Shop</h4>
            <ul className="space-y-2">
              {[
                { href: '/shop', label: 'All Products' },
                { href: '/shop/tshirts', label: 'T-Shirts' },
                { href: '/shop/hoodies', label: 'Hoodies' },
                { href: '/shop/sweatshirts', label: 'Sweatshirts' },
                { href: '/shop?filter=sale', label: <><Flame size={14} className="inline mr-1" /> Sale</> },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Discover */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Discover</h4>
            <ul className="space-y-2">
              {[
                { href: '/color-finder', label: <><Sparkles size={14} className="inline mr-1" /> Find Your Color</> },
                { href: '/blog', label: 'Blog' },
                { href: '/about', label: 'Our Story' },
                { href: '/contact', label: 'Contact Us' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Help</h4>
            <ul className="space-y-2">
              {[
                { href: '/faq', label: 'FAQs' },
                { href: '/shipping', label: 'Shipping Info' },
                { href: '/returns', label: 'Returns & Exchanges' },
                { href: '/size-guide', label: 'Size Guide' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Service' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} BoldType. All rights reserved. Made with <Heart size={12} className="inline text-brand-pink" /> in Canada.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">Secure payments via</span>
            <div className="flex gap-2">
              {['VISA', 'MC', 'AMEX', 'PAYPAL'].map((card) => (
                <span key={card} className="text-xs bg-white/10 px-2 py-1 rounded font-mono text-gray-400">
                  {card}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
