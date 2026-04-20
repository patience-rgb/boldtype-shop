export const metadata = { title: 'FAQs' }

const faqs = [
  { q: 'Where do you ship?', a: 'We ship across Canada and internationally. Free shipping on Canadian orders over $75 CAD.' },
  { q: 'How long does shipping take?', a: 'Canadian orders typically arrive in 3–7 business days. International orders take 7–14 business days.' },
  { q: 'What is your return policy?', a: 'We accept returns within 30 days of delivery for unworn, unwashed items with tags attached.' },
  { q: 'How do I find my size?', a: 'Check out our Size Guide for detailed measurements. We recommend sizing up for a relaxed fit.' },
  { q: 'Are the colours true to the photos?', a: 'We do our best! Colour may vary slightly by screen. Our high-saturation palette means what you see is close to what you get.' },
  { q: 'Do you restock sold-out items?', a: 'Yes! Sign up for restock alerts on the product page or follow us on Instagram for announcements.' },
]

export default function FaqPage() {
  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-script text-5xl text-brand-pink mb-10">FAQs.</h1>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-brand-black mb-2">{faq.q}</h3>
              <p className="text-gray-600 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
