import { ColorFinderWizard } from '@/components/ColorFinderWizard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Find Your Power Color',
  description: 'Take our 3-step skin undertone quiz and discover which bold BoldType colors were made for you.',
}

export default function ColorFinderPage() {
  return (
    <div className="pt-[104px] min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-purple via-brand-blue to-brand-pink py-16 px-4 text-center text-white">
        <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-3">Bold – Bright – Trend</p>
        <h1 className="font-script text-5xl sm:text-6xl mb-4">find your power color.</h1>
        <p className="text-white/90 max-w-xl mx-auto text-base leading-relaxed">
          Unlock your best look. Your skin&apos;s undertone is the key to making our high-saturation hoodies and tees truly pop.
          Find your vibe, then wear your color!
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <ColorFinderWizard />
      </div>
    </div>
  )
}
