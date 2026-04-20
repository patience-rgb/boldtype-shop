export const metadata = { title: 'Our Story' }

export default function AboutPage() {
  return (
    <div className="pt-[104px] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-script text-5xl text-brand-pink mb-6">our story.</h1>
        <div className="prose prose-lg max-w-none space-y-5 text-gray-700">
          <p className="text-xl font-semibold text-brand-black">BoldType started with one belief: life is too short for boring clothes.</p>
          <p>We're a Canadian apparel brand obsessed with bright, saturated colour and the way the right hue can completely transform how you feel walking out the door. Every piece we make is designed to make heads turn — in the best way possible.</p>
          <p>Based in Canada, we create hoodies, sweatshirts, and tees in the kind of colours that don't apologise for themselves. Our Power Colour system is built around your skin's undertone, so you don't just look good — you glow.</p>
          <p className="font-semibold text-brand-purple">Bold. Bright. Trend. That's BoldType.</p>
        </div>
      </div>
    </div>
  )
}
