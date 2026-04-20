export const metadata = { title: 'Terms of Service' }

export default function TermsPage() {
  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-script text-5xl text-brand-pink mb-6">terms of service.</h1>
        <div className="bg-white rounded-2xl p-8 shadow-sm prose prose-sm max-w-none text-gray-600 space-y-4">
          <p className="text-xs text-gray-400">Last updated: April 2025</p>
          <p>By using BoldType&apos;s website and placing orders, you agree to these terms.</p>
          <h3 className="font-bold text-brand-black">Orders & Payment</h3>
          <p>All prices are in CAD. We reserve the right to cancel orders at our discretion. Payment is processed securely via Stripe.</p>
          <h3 className="font-bold text-brand-black">Shipping & Delivery</h3>
          <p>Delivery times are estimates and not guaranteed. BoldType is not responsible for delays caused by carriers or customs.</p>
          <h3 className="font-bold text-brand-black">Returns</h3>
          <p>See our <a href="/returns" className="text-brand-pink">Returns & Exchanges</a> policy for full details.</p>
          <h3 className="font-bold text-brand-black">Intellectual Property</h3>
          <p>All content on this site is owned by BoldType and may not be reproduced without permission.</p>
          <h3 className="font-bold text-brand-black">Contact</h3>
          <p>Questions? Email <a href="mailto:hello@boldtypefit.ca" className="text-brand-pink">hello@boldtypefit.ca</a></p>
        </div>
      </div>
    </div>
  )
}
