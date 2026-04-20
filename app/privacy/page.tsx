export const metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-script text-5xl text-brand-pink mb-6">privacy policy.</h1>
        <div className="bg-white rounded-2xl p-8 shadow-sm prose prose-sm max-w-none text-gray-600 space-y-4">
          <p className="text-xs text-gray-400">Last updated: April 2025</p>
          <p>BoldType (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your privacy. This policy explains how we collect, use, and protect your personal information.</p>
          <h3 className="font-bold text-brand-black">Information We Collect</h3>
          <p>We collect information you provide when placing an order (name, email, shipping address, payment info) and basic analytics data about site usage.</p>
          <h3 className="font-bold text-brand-black">How We Use It</h3>
          <p>We use your information to process orders, send order updates, and occasionally send marketing emails (you can unsubscribe anytime).</p>
          <h3 className="font-bold text-brand-black">Data Security</h3>
          <p>Your payment information is processed securely through Stripe. We never store credit card details.</p>
          <h3 className="font-bold text-brand-black">Contact</h3>
          <p>Privacy questions? Email us at <a href="mailto:hello@boldtypefit.ca" className="text-brand-pink">hello@boldtypefit.ca</a></p>
        </div>
      </div>
    </div>
  )
}
