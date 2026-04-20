export const metadata = { title: 'Shipping Info' }

export default function ShippingPage() {
  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-script text-5xl text-brand-pink mb-10">shipping info. 📦</h1>
        <div className="space-y-6">
          {[
            { title: 'Canada', items: ['Free shipping on orders over $75 CAD', 'Standard: 3–7 business days — $8.99', 'Express: 1–3 business days — $18.99'] },
            { title: 'United States', items: ['Standard: 5–10 business days — $14.99', 'Express: 2–5 business days — $29.99'] },
            { title: 'International', items: ['Standard: 7–14 business days — $24.99', 'Duties and taxes may apply at customs'] },
          ].map((section) => (
            <div key={section.title} className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-brand-pink mt-0.5">→</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
