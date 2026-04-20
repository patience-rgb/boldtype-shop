export const metadata = { title: 'Returns & Exchanges' }

export default function ReturnsPage() {
  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-script text-5xl text-brand-pink mb-6">returns & exchanges.</h1>
        <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2">30-Day Return Policy</h3>
            <p className="text-gray-600 text-sm">We accept returns within 30 days of delivery. Items must be unworn, unwashed, and have original tags attached.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">How to Return</h3>
            <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
              <li>Email us at hello@boldtypefit.ca with your order number</li>
              <li>We'll send you a return label within 1–2 business days</li>
              <li>Pack and ship the item back to us</li>
              <li>Refund processed within 5–7 business days of receiving the return</li>
            </ol>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Exchanges</h3>
            <p className="text-gray-600 text-sm">Want a different size or colour? We're happy to exchange. Just mention it in your return email and we'll sort it out.</p>
          </div>
          <div className="bg-brand-pink/10 rounded-xl p-4">
            <p className="text-sm font-semibold text-brand-pink">Sale items are final sale and not eligible for return.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
